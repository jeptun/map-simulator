import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {EntityDetailPanel} from "@/components/panels/EntityDetailPanel.tsx";
import {SimulationControlPanel} from "@/components/panels/SimulationControlPanel.tsx";
import {SimulationLogPanel} from "@/components/panels/SimulationLogPanel.tsx";


export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar  {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Side Panel</SidebarGroupLabel>
                    <SidebarGroupContent>

                        <SidebarMenu>
                            <SidebarMenuItem>
                                <EntityDetailPanel/>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SimulationLogPanel/>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SimulationControlPanel/>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
