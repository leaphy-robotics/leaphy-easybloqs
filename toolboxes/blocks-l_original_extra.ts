import sep from './separator';

const leaphyOriginalExtraBlocks = [
    {
        kind: "block",
        type: "leaphy_io_digitalwrite"
    },
    sep,
    {
        kind: "block",
        type: "leaphy_io_analogwrite",
        blockxml: `<block type="leaphy_io_analogwrite">
        <value name="NUM">
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
        type: "leaphy_servo_write",
        blockxml: `<block type="leaphy_servo_write">
        <value name="SERVO_ANGLE">
            <shadow type="math_number">
                <field name="NUM">
                    90
                </field>
            </shadow>
        </value>
    </block>`
    },
    sep,
    {
        kind: "block",
        type: "leaphy_sonar_read",
    },
    {
        kind: "block",
        type: "leaphy_rgb_color",
    },
    sep,
    {
        kind: "block",
        type: "leaphy_rgb_color_raw",
    },
    {
        kind: "block",
        type: "leaphy_led_set_strip",
        blockxml: `<block type="leaphy_led_set_strip">
        <value name="LED_SET_PIN">
            <shadow type="math_number">
                <field name="NUM">
                    0
                </field>
            </shadow>
        </value>
        <value name="LED_SET_LEDS">
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
        type: "leaphy_led_set_basic",
        blockxml: `<block type="leaphy_led_set_basic">
        <value name="LED_SET_LED">
            <shadow type="math_number">
                <field name="NUM">
                    0
                </field>
            </shadow>
        </value>
        <value name="LED_BASIC_RED">
            <shadow type="math_number">
                <field name="NUM">
                    0
                </field>
            </shadow>
        </value>
        <value name="LED_BASIC_GREEN">
            <shadow type="math_number">
                <field name="NUM">
                    0
                </field>
            </shadow>
        </value>
        <value name="LED_BASIC_BLUE">
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
        type: "leaphy_led_set_speed",
        blockxml: `<block type="leaphy_led_set_speed">
        <value name="LED_SET_SPEEDVALUE">
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
        type: "leaphy_led_strip_demo",
        blockxml: `<block type="leaphy_led_strip_demo">
        <value name="LED_STRIP_DEMO_RED">
            <shadow type="math_number">
                <field name="NUM">
                    0
                </field>
            </shadow>
        </value>
        <value name="LED_STRIP_DEMO_GREEN">
            <shadow type="math_number">
                <field name="NUM">
                    0
                </field>
            </shadow>
        </value>
        <value name="LED_STRIP_DEMO_BLUE">
            <shadow type="math_number">
                <field name="NUM">
                    0
                </field>
            </shadow>
        </value>
    </block>`
    }
]

export default leaphyOriginalExtraBlocks;