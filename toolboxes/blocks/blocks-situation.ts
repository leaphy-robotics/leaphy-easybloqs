import sep from './separator';

const situationBlocks = [
    {
        kind: "block",
        type: "time_delay",
        blockxml: `<block type="time_delay">
<value name="DELAY_TIME_MILI">
  <shadow type="math_number">
    <field name="NUM">1000</field>
  </shadow>
</value>
</block>`
    },
    sep,
    {
        kind: "block",
        type: "controls_repeat_forever",
    },
    sep,
    {
        kind: "block",
        type: "controls_repeat_ext",
        blockxml: `<block type="controls_repeat_ext">
        <value name="TIMES">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>`
    },
    sep,
    {
        kind: "block",
        type: "controls_if",
    },
    sep,
    {
        kind: "block",
        type: "controls_if",
        blockxml: `<block type="controls_if">
        <mutation else="1"/>
  </block>`
    },
    sep,
    {
        kind: "block",
        type: "controls_whileUntil",
    }
]

export default situationBlocks;