import React, { useState } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import DateTimePicker, {
  EvtTypes,
} from "@react-native-community/datetimepicker";
import { formattedDateStr } from "@/utils/dateTime";
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
  const { unsettledTransaction, updateUnsettledTransaction } = useAppContext();
  const currentDate = unsettledTransaction?.transactionDate || new Date();
  const [show, setShow] = useState(false);
  const { theme, currentTheme } = useThemeContext();

  // Handle date change
  const onChange = (event: EventT, selectedDate: Date | undefined) => {
    setShow(Platform.OS === "ios"); // Keep the picker open for iOS
    updateUnsettledTransaction({
      ...unsettledTransaction,
      transactionDate: selectedDate,
    }); // Set the selected date
    setShow(false);
  };

  const { dateShort } = formattedDateStr(currentDate);

  return (
    <View style={[commonStyles.rowSection]}>
      {show ? (
        <DateTimePicker
          accentColor={theme.colors.primary}
          textColor={theme.colors.primary}
          value={currentDate}
          mode="date"
          display="default"
          onChange={onChange}
          themeVariant={currentTheme}
        />
      ) : (
        <View style={[commonStyles.rowSection, { gap: 10 }]}>
          <Text style={[styles.date, { color: theme.colors.text }]}>
            {dateShort}
          </Text>
          <Icon
            name="edit-calendar"
            onPress={() => {
              setShow(true);
            }}
            size={24}
            color={theme.colors.primary}
          />
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
