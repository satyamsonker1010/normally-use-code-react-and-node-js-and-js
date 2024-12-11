import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { Box, Button, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const todayDate = dayjs();
const maxDatesShow = todayDate.add(30, "day");

// Call api and get Date available dates.
function getDatesOfSlots(date, { signal }) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const today = dayjs().startOf("day");
      const endDate = today.add(14, "day");
      const daysToHighlight = [];

      for (let i = 0; i < 15; i++) {
        const nextDay = dayjs(today).add(i, "day");
        if (dayjs(nextDay).isBetween(today, endDate, "day", "[]")) {
          daysToHighlight.push(nextDay.format("YYYY-MM-DD"));
        }
      }
      resolve({ daysToHighlight });
    }, 100);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException("aborted", "AbortError"));
    };
  });
}

const shouldDisableDate = (date) => {
  const today = dayjs();
  const next15Days = today.add(14, "day");
  return date.isBefore(today, "day") || date.isAfter(next15Days, "day");
};

const currentDate = dayjs().format("YYYY-MM-DD");
const nextDate = dayjs().add(1, "day").format("YYYY-MM-DD");

const blockDatesArr = [currentDate, nextDate];

function blockedDates(blockedDatedArray, blockDate) {
  const status = blockedDatedArray?.includes(blockDate.format("YYYY-MM-DD"));
  return status;
}

function ServerDay(props) {
  const {
    highlightedDays = [],
    day,
    outsideCurrentMonth,
    selectedDate,
    setSelectedDate,
    ...other
  } = props;

  //  Blocked my own slots date
  const blockedDateStatus = blockedDates(blockDatesArr, day);
  //  This is used for disabling other dates
  const otherDateDisabledOrNot = shouldDisableDate(day);
  //  This is used for providing color in my first 15 dates
  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(day.format("YYYY-MM-DD")) >= 0;

  const handleDayClick = () => {
    setSelectedDate(day);
  };

  return (
    <PickersDay
      {...other}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      sx={{
        backgroundColor: (() => {
          if (blockedDateStatus) return "#FFE3E3";
          if (isSelected && !blockedDateStatus) return "#FFDF98";
          return "transparent";
        })(),
        color: (() => {
          if (blockedDateStatus) return "#FFA9A9";
          return "inherit";
        })(),
      }}
      disabled={blockedDateStatus || otherDateDisabledOrNot}
      onClick={handleDayClick}
    />
  );
}

export default function CalendarShow() {
  const requestAbortController = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const fetchHighlightedDays = async (date) => {
    const controller = new AbortController();
    getDatesOfSlots(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  useEffect(() => {
    fetchHighlightedDays("");
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }
    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  //   When click on the continue button
  const handleContinueBtnClick = () => {
    if (!selectedDate) {
      enqueueSnackbar("Please select valid date.", { variant: "error" });
      return;
    }
    const selectedDateFormat = dayjs(selectedDate).format("YYYY-MM-DD");
    navigate(
      `/slot-booked-calender?selected-date=${selectedDateFormat}&booking-type=0&event-id=1`
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <Box p={1} py={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            sx={{
              minWidth: "200px",
              maxWidth: "1080px",
              border: "1px solid #E0E0E0",
              borderRadius: "10px",
              backgroundColor: "white",
              width: "100%",
              ".MuiDayCalendar-weekContainer": {
                display: "flex",
                justifyContent: "space-between",
                margin: "10px 0",
                padding: "0 10px",
              },
              ".MuiDayCalendar-header": {
                display: "flex",
                justifyContent: "space-between",
                padding: "0 10px",
                borderBottom: "1px solid #E0E0E0",
              },
            }}
            loading={isLoading}
            onMonthChange={handleMonthChange}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
              day: ServerDay,
            }}
            slotProps={{
              day: {
                highlightedDays,
                selectedDate,
                setSelectedDate,
              },
            }}
            minDate={todayDate}
            maxDate={maxDatesShow}
          />
        </LocalizationProvider>
        <Box mt={1} mb={1} px={1} sx={{ display: "flex", gap: 1 }}>
          <Box
            mt={0.5}
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              backgroundColor: "#FFA9A9",
            }}
          ></Box>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "11px", color: "#000000", fontWeight: "bold" }}
            >
              Already Booked
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        p="8px 10px"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItem: "center",
          backgroundColor: "#ffffff",
          position: "relative",
          "::before": {
            content: '""',
            width: "20px",
            height: "20px",
            backgroundColor: "#F9F9F9",
            borderRadius: "50%",
            position: "absolute",
            top: "-10px",
            left: "20px",
            zIndex: "1",
          },
          "::after": {
            content: '""',
            width: "20px",
            height: "20px",
            backgroundColor: "#F9F9F9",
            borderRadius: "50%",
            position: "absolute",
            top: "-10px",
            right: "20px",
            zIndex: "1",
          },
        }}
      >
        {/* <Box
          sx={{
            width: "20px",
            height: "20px",
            backgroundColor: "#F9F9F9",
            borderRadius: "50%",
            position: "absolute",
            top: "-10px",
            zIndex: "1",
          }}
          id="circle-box-data"
        ></Box> */}

        <Box width={"100%"}>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              width: "100%",
              height: "50px",
              backgroundColor: "#009863",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "10px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#009863" },
            }}
            onClick={handleContinueBtnClick}
          >
            Book Now
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
