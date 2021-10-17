import sep from './separator';
import { leaphySerialBlocks, leaphyIoDigitalWriteBlock, leaphyIoAnalogWriteBlock, leaphyServoWriteBlock, leaphyDigitalAnalogReadBlocks, leaphyBuzzBlock, leaphySonarBlock, leaphyRgbBlocks, leaphyLedBlocks } from './blocks-l_common';

export const leaphyOriginalBlocks = [
    {
        kind: "block",
        type: "leaphy_original_set_led",
        blockxml: `<block type="leaphy_original_set_led">
        <value name="LED_RED">
            <shadow type="math_number">
                <field name="NUM">0</field>
            </shadow>
        </value>
        <value name="LED_GREEN">
            <shadow type="math_number">
                <field name="NUM">0</field>
            </shadow>
        </value>
        <value name="LED_BLUE">
            <shadow type="math_number">
                <field name="NUM">0</field>
            </shadow>
        </value>
    </block>`
    },
    sep,
    {
        kind: "block",
        type: "leaphy_original_set_motor",
        blockxml: `<block type="leaphy_original_set_motor">
        <value name="MOTOR_SPEED">
            <shadow type="math_number">
                <field name="NUM">
                    100
                </field>
            </shadow>
        </value>
    </block>`
    },
    sep,
    {
        kind: "block",
        type: "leaphy_original_move_motors",
        blockxml: `<block type="leaphy_original_move_motors">
        <value name="MOTOR_SPEED">
            <shadow type="math_number">
                <field name="NUM">
                    100
                </field>
            </shadow>
        </value>
    </block>`
    },
    sep,
    leaphyBuzzBlock,
    sep,
    ...leaphySerialBlocks,
    sep,
    {
        kind: "block",
        type: "leaphy_original_get_distance"
    },
    sep,
    ...leaphyDigitalAnalogReadBlocks
]

export const leaphyOriginalExtraBlocks = [
    leaphyIoDigitalWriteBlock,
    sep,
    leaphyIoAnalogWriteBlock,
    sep,
    leaphyServoWriteBlock,
    sep,
    leaphySonarBlock,
    ...leaphyRgbBlocks,
    ...leaphyLedBlocks
]
