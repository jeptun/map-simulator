import {AppSidebar} from "@/components/app-sidebar"

import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"

import {ModeToggle} from "@/components/mode-toggle.tsx";
import NavMenu from "@/components/NavMenu.tsx";


export default function PageLayout() {
    return (
        <SidebarProvider>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <NavMenu/>
                    <div className='-mr-1 ml-auto '>
                        <ModeToggle/>
                        <SidebarTrigger className="rotate-180"/>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min text-center">Map Content
                    </div>
                </div>
            </SidebarInset>
            <AppSidebar side="right"/>
        </SidebarProvider>
    )
}
