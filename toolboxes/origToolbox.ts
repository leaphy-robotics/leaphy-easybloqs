import leaphyOriginalExtraBlocks from "./blocks/blocks-l_original_extra";
import leaphyOriginalBlocks from "./blocks/blocks-l_original";
import baseCategories from "./baseCategories";

const origToolbox = {
    kind: "categoryToolbox",
    id: "easyBloqsToolbox",
    contents: [
        ...baseCategories,
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
    ]
}

export default origToolbox;
