import React from "react";
import {PropTypes} from "react";
import {Link} from "react-router/es";
import counterpart from "counterpart";
import ReactTooltip from "react-tooltip";
import Icon from "../Icon/Icon";
import AccountInfo from "./AccountInfo";
import Translate from "react-translate-component";
import AccountActions from "actions/AccountActions";
import SettingsActions from "actions/SettingsActions";

class AccountLeftPanel extends React.Component {

	static propTypes = {
		account: React.PropTypes.object.isRequired,
		linkedAccounts: PropTypes.object,
	};

	static contextTypes = {
		history: React.PropTypes.object
	}

	constructor(props) {
		super(props);
		this.last_path = null;

		this.state = {
			showAdvanced: props.viewSettings.get("showAdvanced", false)
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		const changed = this.last_path !== window.location.hash;
		this.last_path = window.location.hash;
		return (
			changed ||
			this.props.account !== nextProps.account ||
			this.props.linkedAccounts !== nextProps.linkedAccounts ||
			nextState.showAdvanced !== this.state.showAdvanced
		);
	}

	componentWillUnmount() {
		ReactTooltip.hide();
	}

	onLinkAccount(e) {
		e.preventDefault();
		AccountActions.linkAccount(this.props.account.get("name"));
	}

	onUnlinkAccount(e) {
		e.preventDefault();
		AccountActions.unlinkAccount(this.props.account.get("name"));
	}

	_toggleAdvanced(e) {
		e.preventDefault();
		let newState = !this.state.showAdvanced;
		this.setState({
			showAdvanced: newState
		});

		SettingsActions.changeViewSetting({showAdvanced: newState});
	}

	render() {
		let {account, linkedAccounts, isMyAccount} = this.props;
		let account_name = account.get("name");
		let linkBtn = null;

		linkBtn = isMyAccount ? null : linkedAccounts.has(account_name) ?
			<a style={{marginBottom: "1rem", marginRight: 0}} href className="button outline block-button" onClick={this.onUnlinkAccount.bind(this)}><Translate
				content="account.unfollow"/></a> :
			<a style={{marginBottom: "1rem", marginRight: 0}} href className="button outline block-button" onClick={this.onLinkAccount.bind(this)}><Translate
				content="account.follow"/></a>;

		let settings = counterpart.translate("header.settings");

		let caret = this.state.showAdvanced ? <span>&#9660;</span> : <span>&#9650;</span>;

		return (
			<div className="grid-block vertical account-left-panel no-padding no-overflow">
				<div className="grid-block">
					<div className="grid-content no-padding" style={{overflowX: "hidden"}}>

						<div className="regular-padding">
							<AccountInfo account={account.get("id")} image_size={{height: 140, width: 140}} my_account={isMyAccount}/>
							<div className="grid-container no-margin">
								{ linkBtn }
								<Link className="pay-button button small block-button" to={`/transfer/?to=${account_name}`}><Translate content="account.pay"/></Link>
							</div>
						</div>
						<section className="block-list">
							<ul className="account-left-menu" style={{marginBottom: 0}}>
								<li><Link to={`/account/${account_name}/overview/`} activeClassName="active"><Translate content="account.overview"/></Link></li>
								<li><Link to={`/account/${account_name}/member-stats/`} activeClassName="active"><Translate content="account.member.stats"/></Link></li>
								{isMyAccount?<li><Link to={`/account/${account_name}/whitelist/`} activeClassName="active"><Translate content="account.whitelist.title"/></Link></li>:null}
								<li><Link to={`/account/${account_name}/voting/`} activeClassName="active"><Translate content="account.voting"/></Link></li>
                                {isMyAccount?<li><Link to={`/account/${account_name}/vesting/`} activeClassName="active"><Translate content="account.vesting.title"/></Link></li>:null}
								<li><Link to={`/account/${account_name}/permissions/`} activeClassName="active"><Translate content="account.permissions"/></Link></li>
							</ul>
						</section>
					</div>
				</div>
			</div>
		);
	}
}

export default AccountLeftPanel;
