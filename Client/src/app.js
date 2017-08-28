/**
 * Created by jwb19 on 2017-02-09.
 */
import React from 'react';
import ReactDOM from 'react-dom'
import MaterialUIExComponent from './materialuiex'
// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin();
ReactDOM.render(
		<MaterialUIExComponent />, document.getElementById('app')
)
