import React from "react";

const FilmsContext = React.createContext({
    items: [],
    addItem: (item) => {},
    removeItem: (id) => {},
    loadItems: () => {}
})

export default FilmsContext