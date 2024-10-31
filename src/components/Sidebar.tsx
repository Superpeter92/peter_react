import { ComponentType, SVGProps, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";

import {
  Bars3Icon,
  XMarkIcon,
  ChevronUpIcon,
  UserIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import { useAuth } from "../utils/store/useAuth";
import { useQuery } from "react-query";
import avatar from "../assets/profile.png";
import logo from "../assets/logo.png";
import { FeatureWithPermissions } from "../model/feature";
import { getFeatureTree } from "../utils/http";
import SidebarNavLink from "./UI/SidebarNavLink";
// Definizione del tipo per le icone
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

// Interfaccia per il mapping delle icone
interface IconMap {
  [key: string]: IconType;
}
// Interfaces




// Helper functions
const getIconComponent = (iconName: string): IconType => {
  const icons: IconMap = {
    UserIcon,
    CalendarIcon,
    MagnifyingGlassIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
  };
  return icons[iconName] || UserIcon;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}



// DynamicNavItem Component
const DynamicNavItem: React.FC<{
  feature: FeatureWithPermissions;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ feature, setSidebarOpen }) => {
  const IconComponent = getIconComponent(feature.icon);

  if (feature.children && feature.children.length > 0) {
    return (
      <Disclosure>
        {({ open }) => (
          <>
            <DisclosureButton className="group flex w-full items-center justify-between rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-purple-500">
              <div className="flex justify-start gap-x-2">
                <IconComponent className="h-6 w-6 shrink-0 text-white" />
                <span>{feature.name}</span>
              </div>
              <ChevronUpIcon
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-white`}
              />
            </DisclosureButton>
            <DisclosurePanel className="space-y-1 px-7 py-2 text-sm text-white">
              {feature.children.map((child) => (
                <DynamicNavItem
                  key={child.id}
                  feature={child}
                  setSidebarOpen={setSidebarOpen}
                />
              ))}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    );
  }

  return (
    <SidebarNavLink
      to={feature.path}
      setSidebarOpen={setSidebarOpen}
      className={({ isActive }) =>
        classNames(
          isActive
            ? "active bg-darkPurplue"
            : "text-white hover:bg-purple-500",
          "group flex gap-x-2 rounded-md p-2 text-sm font-semibold leading-6 text-white"
        )
      }
    >
      <IconComponent
        className="h-6 w-6 shrink-0 text-white"
        aria-hidden="true"
      />
      {feature.name}
    </SidebarNavLink>
  );
};

// Main Sidebar Component
export const Sidebar: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useAuth((state) => state);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch delle feature
  const { data: featureTree, isLoading } = useQuery<FeatureWithPermissions[]>(
    ["getFeatureTree", user?.ruolo.id],
    async () => await getFeatureTree(user!.ruolo.id),
    {
      enabled: !!user?.ruolo.id,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );

  // User navigation items
  const userNavigation = [{ name: "Profilo", path: "/profile" }];

  // Filter features based on user permissions
  return (
    <>
      <div>
        {/* Mobile sidebar */}
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar content */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-purplue px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <img className="h-8 w-auto" src={logo} alt="logo" />
                </div>

                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-1">
                    {/* Dynamic Feature Navigation */}
                    {!isLoading && featureTree?.map((feature) => (
                      <li key={feature.id}>
                        <DynamicNavItem
                          feature={feature}
                          setSidebarOpen={setSidebarOpen}
                        />
                      </li>
                    ))}

                    {/* Logout Button */}
                    <li className="-mx-2 mt-auto space-y-1">
                      <button
                        onClick={logout}
                        className="group flex w-full gap-x-2 rounded-md p-2 font-montserrat text-sm font-semibold leading-6 text-white hover:bg-purple-950"
                      >
                        <ArrowRightStartOnRectangleIcon
                          className="h-6 w-6 shrink-0 text-white"
                          aria-hidden="true"
                        />
                        Logout
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop and header */}
        <div>
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-purplue px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>

            <NavLink to="/">
              <img className="h-8 w-auto" src={logo} alt="logo" />
            </NavLink>

            {/* Profile dropdown */}
            <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <Menu as="div" className="relative">
                  {({ open }) => (
                    <>
                      <MenuButton className="-m-1.5 flex items-center p-1.5">
                        <span className="sr-only">Open user menu</span>
                        <img src={avatar} width="40" alt="avatar" />
                        <span className="hidden lg:flex lg:items-center">
                          <span
                            className="ml-4 font-montserrat text-sm font-semibold leading-6 text-white"
                          >
                            {user?.nome} {user?.cognome}
                          </span>
                          <ChevronUpIcon
                            className={classNames(
                              open ? "rotate-180 transform" : "",
                              "ml-2 h-5 w-5 text-white"
                            )}
                          />
                        </span>
                      </MenuButton>
                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                      >
                        {userNavigation.map((item) => (
                          <MenuItem key={item.name}>
                            <NavLink
                              to={item.path}
                              className="block px-3 py-1 font-montserrat text-sm leading-6 text-purplue hover:bg-gray-100"
                            >
                              {item.name}
                            </NavLink>
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </div>

          <main>{children}</main>
        </div>
      </div>
    </>
  );
};