import { Select } from "chakra-react-select";

const chakraStyles = ({ libraryColor, size }) => {
  return {
    dropdownIndicator: (provided, state) => ({
      ...provided,
      _focus: {
        borderColor: libraryColor ?? "accent",
      },
      background: state.isFocused ? libraryColor : "bg-canvas",
      color: "default",
      p: 0,
      w: size === "sm" ? "20px" : "40px",
      fontSize: "xs",
      pt: 0,
    }),
    clearIndicator: (provided, state) => ({
      ...provided,
      _focus: {
        borderColor: libraryColor ?? "accent",
      },
      background: state.isFocused ? libraryColor : provided.background,
      p: 0,
      w: "20px",
      h: size === "sm" ? "22px" : undefined,
      fontSize: "7px",
      size: "xs",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      background: "transparent",
      border: "solid 0.5px",
      fontSize: "xs",
      pt: 0,
      borderColor: "subtle",
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: size === "sm" ? "xs" : "sm",
      overflowX: "hidden",
    }),
    menuList: (provided, state) => ({
      ...provided,
      fontSize: "7px",
      color: "muted",
      borderColor: "subtle",
      pt: 0,
      _focus: {
        borderColor: libraryColor ?? "accent",
      },
      _hover: {
        borderColor: libraryColor ?? "accent",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      pt: 0,
      fontSize: "xs",
      color: undefined,
    }),
    container: (provided) => ({
      ...provided,
      p: 0,
    }),
    inputContainer: (provided) => ({
      ...provided,
      p: 0,
    }),
    valueContainer: (provided) => ({
      ...provided,
      fontSize: size === "sm" ? "xs" : "sm",
      py: size === "sm" ? 0 : 0,
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: "subtle",
      fontSize: "xs",
      minH: undefined,
      pt: 0,
      h: size === "sm" ? "22px" : undefined,
      _focus: {
        borderColor: libraryColor ?? "accent",
      },
      _hover: {
        borderColor: libraryColor ?? "accent",
      },
      p: 0,
      w: size === "sm" ? "100px" : "170px",
    }),
  };
};

export const CustomReactSelect: any = ({
  name,
  helpText,
  label,
  isMulti,
  libraryColor,
  size,
  options = [],
  ...rest
}) => {
  return (
    <Select
      menuPortalTarget={document.body}
      isMulti={isMulti}
      options={options}
      chakraStyles={chakraStyles({ libraryColor, size })}
      {...rest}
      styles={{
        menuPortal: (provided) => ({
          ...provided,
          zIndex: 9999,
        }),
      }}
    />
  );
};

CustomReactSelect.displayName = "CustomReactSelect";
