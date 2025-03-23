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
import CardItem from "@/components/card-item.tsx";


export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar  {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Table of Contents</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <CardItem/>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <CardItem/>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <CardItem/>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
