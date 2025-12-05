'use client'

import { HeaderRoot } from './header/header-root'
import { HeaderLogo } from './header/header-logo'
import { HeaderAppName } from './header/header-app-name'
import { HeaderActions } from './header/header-actions'
import { HeaderSystemControls } from './header/header-system-controls'
import { HeaderNavigation } from './header/header-navigation'
import type { AppKey } from '../types'

interface HeaderProps {
  children: React.ReactNode
  currentApp: AppKey
}

function Header({ children, currentApp }: HeaderProps) {
  return <HeaderRoot currentApp={currentApp}>{children}</HeaderRoot>
}

Header.Root = HeaderRoot
Header.Logo = HeaderLogo
Header.AppName = HeaderAppName
Header.Actions = HeaderActions
Header.SystemControls = HeaderSystemControls
Header.Navigation = HeaderNavigation

export { Header }