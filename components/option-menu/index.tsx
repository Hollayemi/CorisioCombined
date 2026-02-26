import React from "react";
import { View } from "react-native";
import ModalSelector from "react-native-modal-selector";

interface Option {
  key: string;
  label: string;
}

interface OptionProps {
  icon?: any;
  options: Option[];
  selectedValue?: string;
  setSelectedValue: (value: string) => void;
  others?: object;
  Component?: React.ComponentType;
}

const OptionsMenu: React.FC<OptionProps> = ({
  icon,
  options,
  selectedValue,
  setSelectedValue,
  others,
  Component,
}) => {

  return (
    <View className="p-0 w-full rounded-md">
      <ModalSelector
        data={options}
        {...others}
        initValue="Select something!"
        onChange={(option) => {
          setSelectedValue(option.key);
        }}
        className="!bg-red-500"
        backdropPressToClose
        cancelText={"Close"}
        touchableActiveOpacity={0}
        optionTextStyle={{ color: "#1f2937" }} // gray-800
        optionContainerStyle={{ backgroundColor: "#f9fafb" }} // gray-50
        cancelContainerStyle={{ backgroundColor: "#f9fafb" }} // gray-50
        sectionTextStyle={{ color: "#1f2937" }} // gray-800
        selectedItemTextStyle={{ color: "#3b82f6" }} // blue-500
        cancelTextStyle={{ color: "#3b82f6" }} // blue-500
        overlayStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        // Dark mode styles
        style={{ backgroundColor: "", borderColor: "#" }} // white, gray-200
      // Add dark mode variants if needed
      >
        <View className="bg-transparent">
          {Component && <Component />}
        </View>
      </ModalSelector>
    </View>
  );
};

export default OptionsMenu;