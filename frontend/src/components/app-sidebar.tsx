import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {EntityDetailPanel} from "@/components/panels/EntityDetailPanel.tsx";


export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar  {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Table of Contents</SidebarGroupLabel>
                    <SidebarGroupContent>

                        <SidebarMenu>

                            <SidebarMenuItem>
                                <EntityDetailPanel/>
                                {/*        <EntityList/>*/}
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
