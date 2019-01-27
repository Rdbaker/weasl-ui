import React, { Component } from 'react';
import { OrgsAPI } from 'api/org';
import {
  Form,
  TextInput,
  NumberInput,
  Button,
  Toggle,
} from 'carbon-components-react';


class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingGateName: '',
      gateOrgId: 1,
      gateValue: true,
      updatingGate: false,
      gateEditSuccess: false,
      gateEditFailed: false,
    };
  }

  patchGate = async (e) => {
    const {
      editingGateName,
      gateValue,
      gateOrgId,
    } = this.state;
    console.log(1);
    e.preventDefault();
    console.log(2);

    this.setState({
      updatingGate: true,
    });
    console.log(3);

    const response = await OrgsAPI.patchGate(gateOrgId, editingGateName, gateValue);
    const { data } = await response.json();
    console.log(4);

    if (data) {
      this.setState({
        gateEditSuccess: true,
      });
    } else {
      this.setState({
        gateEditFailed: true,
      });
    }
    console.log(5);

    this.setState({
      updatingGate: false,
    });
  }

  onGateNameChange = e => this.setState({ editingGateName: e.target.value })
  onOrgIdChange = e => this.setState({ gateOrgId: Number(e.target.value) })
  onToggleGateEnbled = e => this.setState({ gateValue: e.target.checked })

  render() {
    const {
      editingGateName,
      gateValue,
      gateOrgId,
      updatingGate,
      gateEditSuccess,
      gateEditFailed,
    } = this.state;

    return (
      <div>
        {updatingGate && <div>Updating</div>}
        {!updatingGate && gateEditSuccess && <div>Gate updated successfully!</div>}
        {!updatingGate && gateEditFailed && <div>Gate update failed</div>}
        <Form className="wsl-form" onSubmit={this.patchGate}>
          <TextInput id="gate_name" labelText="Gate Name" value={editingGateName} onChange={this.onGateNameChange} />
          <label>
            Org ID
            <NumberInput id="org_id" value={gateOrgId} onChange={this.onOrgIdChange} />
          </label>
          <label>
            Enable/Disable Gate
            <Toggle id="gate_enabled" onChange={this.onToggleGateEnbled} defaultToggled={gateValue} />
          </label>
          <Button type="submit" onClick={this.patchGate}>Save</Button>
        </Form>
      </div>
    )
  }
}

export default Admin;