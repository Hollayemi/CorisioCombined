import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { CheckIcon } from 'lucide-react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  size = 'medium',
  disabled = false,
}) => {
  const getCheckboxSize = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-center"
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        className={`${getCheckboxSize()} rounded border-2 ${
          checked
            ? 'bg-blue-600 border-blue-600'
            : 'bg-white border-gray-300'
        } ${disabled ? 'opacity-50' : ''} items-center justify-center`}
      >
        {checked && (
          <CheckIcon
            size={getIconSize()}
            color="#FFFFFF"
            strokeWidth={3}
          />
        )}
      </View>
      {label && (
        <Text
          className={`ml-3 text-gray-700 ${
            size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
          } ${disabled ? 'opacity-50' : ''}`}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};