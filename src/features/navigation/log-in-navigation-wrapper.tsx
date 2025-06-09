import type { PropsWithChildren } from "react";
import { NavigationWrapper } from "./navigation-wrapper";

export default async function AuthNavigationWrapper(props: PropsWithChildren) {
  return <NavigationWrapper>{props.children}</NavigationWrapper>;
}
