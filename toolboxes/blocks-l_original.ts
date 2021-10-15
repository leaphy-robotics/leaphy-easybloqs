import sep from './separator';

const leaphyOriginalBlocks = [
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
    {
        kind: "block",
        type: "leaphy_original_buzz",
        blockxml: `<block type="leaphy_original_buzz">
        <value name="FREQUENCY">
            <shadow type="math_number">
                <field name="NUM">
                    440
                </field>
            </shadow>
        </value>
        <value name="DURATION">
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
        type: "leaphy_serial_print_line",
        blockxml: `<block type="leaphy_serial_print_line">
        <value name="VALUE">
            <shadow type="text">
                <field name="TEXT">text</field>
            </shadow>
        </value>
    </block>`
    },
    sep,
    {
        kind: "block",
        type: "leaphy_serial_print_value",
        blockxml: `<block type="leaphy_serial_print_value">
        <value name="NAME">
            <shadow type="text">
                <field name="TEXT">text</field>
            </shadow>
        </value>
        <value name="VALUE">
            <shadow type="math_number">
                <field name="NUM">
                    0
                </field>
            </shadow>
        </value>
    </block>`
    },
    sep,
    {
        kind: "block",
        type: "leaphy_original_get_distance"
    },
    sep,
    {
        kind: "block",
        type: "leaphy_original_digital_read"
    },
    sep,
    {
        kind: "block",
        type: "leaphy_original_analog_read"
    }
]

export default leaphyOriginalBlocks;