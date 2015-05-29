'use strict';

var React = require('react');

var LegacyFieldGraph = require('./LegacyFieldGraph');
var FieldGraphsStore = require('../../stores/field-analyzers/FieldGraphsStore');
var UIUtils = require('../../util/UIUtils');

var FieldGraphs = React.createClass({
    getInitialState() {
        this.notifyOnNewGraphs = false;

        return {
            fieldGraphs: FieldGraphsStore.fieldGraphs
        };
    },
    componentDidMount() {
        this.initialFieldGraphs = this.state.fieldGraphs;
        this.notifyOnNewGraphs = true;

        FieldGraphsStore.onFieldGraphsUpdated = (newFieldGraphs) => this.setState({fieldGraphs: newFieldGraphs});
        FieldGraphsStore.onFieldGraphCreated = (graphId) => {
            if (this.notifyOnNewGraphs && !this.initialFieldGraphs.has(graphId)) {
                var element = React.findDOMNode(this.refs[graphId]);
                UIUtils.scrollToHint(element);
            }
        };
    },
    addFieldGraph(field) {
        var streamId = this.props.searchInStream !== undefined ? this.props.searchInStream.id : undefined;
        FieldGraphsStore.newFieldGraph(field, {interval: this.props.resolution, streamid: streamId});
    },
    deleteFieldGraph(graphId) {
        FieldGraphsStore.deleteGraph(graphId);
    },
    render() {
        var fieldGraphs = [];

        this.state.fieldGraphs
            .sortBy(graph => graph['createdAt'])
            .forEach((graphOptions, graphId) => {
                fieldGraphs.push(
                    <LegacyFieldGraph key={graphId}
                                      ref={graphId}
                                      graphId={graphId}
                                      graphOptions={graphOptions}
                                      onDelete={() => this.deleteFieldGraph(graphId)}
                                      from={this.props.from}
                                      to={this.props.to}
                                      permissions={this.props.permissions}/>
                );
            });

        return (
            <div id="field-graphs">
                {fieldGraphs}
            </div>
        );
    }
});

module.exports = FieldGraphs;