import situationBlocks from "./blocks-situation";
import numbersBlocks from "./blocks-numbers";
import leaphyOriginalExtraBlocks from "./blocks-l_original_extra";
import leaphyOriginalBlocks from "./blocks-l_original";

const categories = {
    kind: "categoryToolbox",
    id: "easyBloqsToolbox",
    contents: [
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
        },
        {
            kind: "category",
            name: "%{BKY_LEAPHY_ORIGINAL_CATEGORY}",
            id: "l_original",
            toolboxitemid: "l_original",
            categorystyle: "leaphy_category",
            contents: leaphyOriginalBlocks
        },
        {
            kind: "category",
            name: "%{BKY_LEAPHY_EXTRA_CATEGORY}",
            id: "l_original_extra",
            toolboxitemid: "l_extra",
            categorystyle: "leaphy_category",
            contents: leaphyOriginalExtraBlocks
        }
    ],
};


export default categories;