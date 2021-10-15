import sep from './separator';

const numbersBlocks = [
    {
        kind: "block",
        type: "math_number",
        blockxml: `<block type="math_number">
        <field name="NUM">123</field>
      </block>`
    },
    sep,
    {
        kind: "block",
        type: "logic_compare",
        blockxml: `<block type="logic_compare">
        <value name="A">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="B">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>`
    },
    sep,
    {
        kind: "block",
        type: "math_arithmetic",
        blockxml: `<block type="math_arithmetic">
        <value name="A">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="B">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>`
    },
    sep,
    {
        kind: "block",
        type: "math_random_int",
        blockxml: `<block type="math_random_int">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>`
    },
    sep,
    {
        kind: "block",
        type: "logic_operation"
    },
    sep,
    {
        kind: "block",
        type: "logic_boolean"
    },
    sep,
    {
        kind: "block",
        type: "logic_negate"
    },
    sep,
    {
        kind: "block",
        type: "math_round",
        blockxml: `<block type="math_round">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">3.1</field>
          </shadow>
        </value>
      </block>`
    },
    sep,
    {
        kind: "block",
        type: "math_number_property",
        blockxml: `<block type="math_number_property">
        <value name="NUMBER_TO_CHECK">
          <shadow type="math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>`
    },
    sep,
    {
        kind: "block",
        type: "math_trig"
    },
    sep,
    {
        kind: "block",
        type: "math_single"
    }
]

export default numbersBlocks;