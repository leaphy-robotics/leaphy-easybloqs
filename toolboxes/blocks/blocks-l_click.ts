import sep from './separator';
import { leaphyIoDigitalWriteBlock, leaphyIoAnalogWriteBlock, leaphyServoWriteBlock, leaphySerialBlocks, leaphyDigitalAnalogReadBlocks, leaphyBuzzBlock, leaphySonarBlock, leaphyRgbBlocks, leaphyLedBlocks } from './blocks-l_common';

export const leaphyClickBlocks = [
    leaphyIoDigitalWriteBlock,
    sep,
    {
        kind: "block",
        type: "leaphy_click_rgb_digitalwrite",
        blockxml: `<block type="leaphy_click_rgb_digitalwrite">
        <field name="PIN1">11</field>
      		<field name="PIN2">12</field>
      		<field name="PIN3">13</field>
    </block>`
    },
    sep,
    leaphyIoAnalogWriteBlock,
    leaphyServoWriteBlock,
    {
        kind: "block",
        type: "leaphy_click_set_motor",
        blockxml: `<block type="leaphy_click_set_motor">
        <value name="MOTOR_SPEED">
				<shadow type="math_number">
					<field name="NUM">100</field>
				</shadow>
			</value>
    </block>`
    },
    ...leaphySerialBlocks,
    ...leaphyDigitalAnalogReadBlocks,
    leaphyBuzzBlock
]

export const leaphyClickExtraBlocks = [
    leaphySonarBlock,
    ...leaphyRgbBlocks,
    ...leaphyLedBlocks
]
