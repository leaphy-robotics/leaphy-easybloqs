import situationBlocks from "./blocks/blocks-situation";
import numbersBlocks from "./blocks/blocks-numbers";

const baseCategories = [
    {
        kind: "category",
        name: "%{BKY_LEAPHY_SITUATION_CATEGORY}",
        id: "l_situation",
        toolboxitemid: "l_situation",
        categorystyle: "situation_category",
        contents: situationBlocks
    },
    {
        kind: "category",
        name: "%{BKY_LEAPHY_NUMBERS_CATEGORY}",
        id: "l_numbers",
        toolboxitemid: "l_numbers",
        categorystyle: "numbers_category",
        contents: numbersBlocks
    },
    {
        kind: "category",
        name: "%{BKY_LEAPHY_VARIABLES_CATEGORY}",
        id: "l_variables",
        toolboxitemid: "l_variables",
        categorystyle: "variables_category",
        custom: "VARIABLE"
    },
    {
        kind: "category",
        name: "%{BKY_LEAPHY_FUNCTIONS_CATEGORY}",
        id: "l_functions",
        toolboxitemid: "l_functions",
        categorystyle: "functions_category",
        custom: "PROCEDURE"
    }
]

export default baseCategories;