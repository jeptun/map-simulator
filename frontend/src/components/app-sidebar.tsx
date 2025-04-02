import * as React from "react"

import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {EntityDetailPanel} from "@/components/panels/EntityDetailPanel.tsx";
import {SimulationControlPanel} from "@/components/panels/SimulationControlPanel.tsx";


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
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/*<SidebarMenuButton>*/}
                        {/*    <Plus />*/}
                        {/*    <span>New Calendar</span>*/}
                        {/*</SidebarMenuButton>*/}
                        <SimulationControlPanel />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
