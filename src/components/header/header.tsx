import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { RootState } from '../../store';
import { LoginStatus, RoutePath } from '../../constant.ts';
import { useAppDispatch } from '../../hooks/use-dispatch.ts';
import { logoutAction, resetUserInfo } from '../../store/slices/user.ts';

export default function Header(): JSX.Element {
  const dispatch = useAppDispatch();
  const authStatus = useSelector((state: RootState) => state.user.authorizationStatus);
  const user = useSelector((state: RootState) => state.user.user);
  const favCount = useSelector((state: RootState) => state.favorites.favorites.length);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutAction())
      .unwrap()
      .then(() => {
        dispatch(resetUserInfo());
      });
  };

  const isLoginPage = location.pathname === RoutePath.Login as string;

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link className="header__logo-link header__logo-link--active" to={RoutePath.Main}>
              <img
                className="header__logo"
                src="/img/logo.svg"
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>
          {!isLoginPage && (
            <nav className="header__nav">
              <ul className="header__nav-list">
                {authStatus === LoginStatus.Auth && user ? (
                  <>
                    <li className="header__nav-item user">
                      <Link
                        className="header__nav-link header__nav-link--profile"
                        to={RoutePath.Favorites}
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper">
                          <img
                            src={user.avatarUrl}
                            alt="User avatar"
                            width="20"
                            height="20"
                            className="header__avatar"
                          />
                        </div>
                        <span className="header__user-name user__name">{user.email}</span>
                        <span className="header__favorite-count">{favCount}</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <Link
                        className="header__nav-link"
                        to={RoutePath.Login}
                        onClick={handleLogout}
                      >
                        <span className="header__login">Sign out</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item user">
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <Link className="header__nav-link" to={RoutePath.Login}>
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
