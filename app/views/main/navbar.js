import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import HTML from '../../utils/html-helper';
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom';
import Lang from '../../lang';
import Avatar from '../../components/avatar';
import Config from 'Config';
import App from '../../core';
import UserAvatar from '../common/user-avatar';
import StatusDot from '../common/status-dot';
import ROUTES from '../common/routes';
import UserMenu from './user-menu';
import UserSettingDialog from '../common/user-setting-dialog';

const navbarItems = [
    {to: ROUTES.chats.recents.__, label: Lang.string('navbar.chats.label'), icon: 'comment-outline', activeIcon: 'comment-processing'},
    {to: ROUTES.chats.groups.__, label: Lang.string('navbar.groups.label'), icon: 'pound', activeIcon: 'pound-box'},
    {to: ROUTES.chats.contacts.__, label: Lang.string('navbar.contacts.label'), icon: 'account-multiple-outline', activeIcon: 'account-multiple'},
];

const NavLink = ({item}) => (
    <Route path={item.to} children={({match}) => (
        <Link className={"block" + (match ? ' active' : '')} to={item.to}><Avatar size={Config.ui['navbar.width']} icon={match ? item.activeIcon : item.icon}/></Link>
    )}/>
);

class MainView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showUserMenu: false,
            noticeBadge: 0,
        };
    }

    handleProfileAvatarClick = () => {
        this.setState({showUserMenu: true});
    }

    handleUserMenuRequestClose = () => {
        this.setState({showUserMenu: false});
    }

    handleSettingBtnClick = e => {
        UserSettingDialog.show();
    }

    componentWillUnmount() {
        App.events.off(this.noticeUpdateHandler);
    }

    componentDidMount() {
        this.noticeUpdateHandler = App.notice.onNoticeUpdate(notice => {
            this.setState({noticeBadge: notice.total});
        });
    }

    render() {
        let {
            className,
            children,
            userStatus,
            ...other
        } = this.props;

        const navbarWidth = Config.ui['navbar.width'];
        const userConfig = App.profile.userConfig;
        const isAvatarOnTop = userConfig && userConfig.avatarPosition === 'top';

        return <div className={HTML.classes('app-navbar', className, {
            'with-avatar-on-top': isAvatarOnTop
        })} {...other}>
            <nav className={`dock-${isAvatarOnTop ? 'top' : 'bottom'} app-nav-profile`}>
                <div className="hint--right" data-hint={App.profile.summaryText}>
                    <a className="block relative app-profile-avatar" onClick={this.handleProfileAvatarClick}>
                        <UserAvatar className="avatar-lg relative" style={{margin: HTML.rem((navbarWidth - 36)/2)}} size={36} user={App.profile.user}/>
                        <StatusDot status={App.profile.userStatus}/>
                    </a>
                </div>
                {this.state.showUserMenu && <UserMenu className={`dock-left dock-${isAvatarOnTop ? 'top' : 'bottom'}`} style={{left: HTML.rem(navbarWidth)}} onRequestClose={this.handleUserMenuRequestClose}/>}
            </nav>
            <nav className="dock-top app-nav-main">
            {
                navbarItems.map(item => {
                    return <div key={item.to} className="hint--right nav-item" data-hint={item.label}>
                        <NavLink item={item}/>
                        {
                            (this.state.noticeBadge && item.to === ROUTES.chats.recents.__) ? <div className="label label-sm dock-right dock-top circle red badge">{this.state.noticeBadge}</div> : null
                        }
                    </div>;
                })
            }
            </nav>
            {
                isAvatarOnTop && <nav className="dock-bottom">
                    <div className="hint--right" data-hint={Lang.string('common.settings')}>
                        <a className="block" onClick={this.handleSettingBtnClick}><Avatar size={navbarWidth} icon="settings"/></a>
                    </div>
                </nav>
            }
        </div>;
    }
}

export default MainView;
