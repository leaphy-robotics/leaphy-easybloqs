import baseCategories from "./baseCategories";

import {leaphyOriginalBlocks, leaphyOriginalExtraBlocks} from "./blocks/blocks-l_original";
import { leaphyFlitzBlocks } from "./blocks/blocks-l_flitz";
import { leaphyClickBlocks, leaphyClickExtraBlocks} from "./blocks/blocks-l_click";

export const origToolbox = {
    kind: "categoryToolbox",
    id: "easyBloqsToolbox",
    contents: [
        {
            kind: "category",
            name: "%{BKY_LEAPHY_ORIGINAL_CATEGORY}",
            id: "l_original",
            toolboxitemid: "l_original",
            categorystyle: "leaphy_category",
            contents: leaphyOriginalBlocks
        },
        ...baseCategories,
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

export const flitzToolbox = {
    kind: "categoryToolbox",
    id: "easyBloqsToolbox",
    contents: [
        {
            kind: "category",
            name: "%{BKY_LEAPHY_FLITZ_CATEGORY}",
            id: "l_flitz",
            toolboxitemid: "l_flitz",
            categorystyle: "leaphy_category",
            contents: leaphyFlitzBlocks
        },
        ...baseCategories
    ]
}

export const clickToolbox = {
    kind: "categoryToolbox",
    id: "easyBloqsToolbox",
    contents: [
        {
            kind: "category",
            name: "%{BKY_LEAPHY_CLICK_CATEGORY}",
            id: "l_click",
            toolboxitemid: "l_click",
            categorystyle: "leaphy_category",
            contents: leaphyClickBlocks
        },
        ...baseCategories,
        {
            kind: "category",
            name: "%{BKY_LEAPHY_EXTRA_CATEGORY}",
            id: "l_click_extra",
            toolboxitemid: "l_extra",
            categorystyle: "leaphy_category",
            contents: leaphyClickExtraBlocks
        }
    ]
}

export default origToolbox;
