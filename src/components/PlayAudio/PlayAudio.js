import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import { updateTemplateData } from '../../actions';

class PlayAudio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audio: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.templateData.get('audio').get('loop') !== nextProps.templateData.get('audio').get('loop')) {
            this.audio.play();
        }
    }

    render() {
        return (
            <div style={{ display: 'none' }}>
                <audio ref={(c) => { this.audio = c; }} src={this.props.templateData.get('audio').get('src')} loop={this.props.templateData.get('audio').get('loop')} autoPlay />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        templateData: state.get('templateData'),
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        updateTemplateData,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(PlayAudio);
