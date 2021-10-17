import sep from './separator';
import { leaphySerialBlocks } from './blocks-l_common';

export const leaphyFlitzBlocks = [
    {
        kind: "block",
        type: "leaphy_flitz_read_stomach_sensor",
        blockxml: `<block type="leaphy_flitz_read_stomach_sensor">
    </block>`
    },
    sep,
    {
        kind: "block",
        type: "leaphy_flitz_read_hand_sensor",
        blockxml: `<block type="leaphy_flitz_read_hand_sensor">
    </block>`
    },
    sep,
    {
        kind: "block",
        type: "leaphy_flitz_led",
        blockxml: `<block type="leaphy_flitz_led">
        <value name="FLITZ_LED_R">
				<shadow type="math_number">
					<field name="NUM">
						0
					</field>
				</shadow>
			</value>
			<value name="FLITZ_LED_G">
				<shadow type="math_number">
					<field name="NUM">
						0
					</field>
				</shadow>
			</value>
			<value name="FLITZ_LED_B">
				<shadow type="math_number">
					<field name="NUM">
						0
					</field>
				</shadow>
			</value>
    </block>`
    },
    sep,
    ...leaphySerialBlocks
]
