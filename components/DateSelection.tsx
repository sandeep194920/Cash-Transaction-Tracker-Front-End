import React, { useState } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import DateTimePicker, {
  EvtTypes,
} from "@react-native-community/datetimepicker";
import { formatDate } from "@/utils/dateTime";
import { commonStyles } from "@/commonStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useThemeContext } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";

type EventT = {
  type: EvtTypes;
  nativeEvent: {
    timestamp: number;
    utcOffset: number;
  };
};

const DatePicker = () => {
  //   const [date, setDate] = useState(new Date());
  const { unsettledTransaction, updateCurrentTransaction } = useAppContext();
  const currentDate = unsettledTransaction?.transactionDate || new Date();
  const [show, setShow] = useState(false);
  const { theme } = useThemeContext();

  // Handle date change
  const onChange = (event: EventT, selectedDate: Date | undefined) => {
    setShow(Platform.OS === "ios"); // Keep the picker open for iOS
    updateCurrentTransaction({ transactionDate: selectedDate }); // Set the selected date
    setShow(false);
  };

  const { date: formattedDate } = formatDate(currentDate, "long");
  return (
    <View style={[commonStyles.rowSection]}>
      {show ? (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
      ) : (
        <View style={[commonStyles.rowSection, { gap: 10 }]}>
          <Icon
            name="edit-calendar"
            onPress={() => {
              setShow(true);
            }}
            size={24}
            color={theme.colors.primary}
          />
          <Text style={[styles.date]}>{formattedDate}</Text>
        </View>
      )}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
