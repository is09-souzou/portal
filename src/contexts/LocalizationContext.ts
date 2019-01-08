import { createContext } from "react";
import locationTextList, { Location, LocationText } from "src/localization/locale";

export type LocalizationValue = {
    location: Location;
    locationText: LocationText;
    handleLocale: () => void
};

// It is declared by React Component
// To make the compilation successful, temporary values ​​are included
export default createContext<LocalizationValue>({
    location: "us",
    locationText: locationTextList["us"],
    handleLocale: () => undefined
});
