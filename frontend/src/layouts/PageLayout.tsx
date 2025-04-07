import {AppSidebar} from "@/components/app-sidebar"
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {ModeToggle} from "@/components/mode-toggle"
import NavMenu from "@/components/NavMenu"
import MapComponent from "@/components/MapComponent"

interface SidebarProviderStyle {
    [key: string]: string | number;
}

export default function PageLayout() {


    return (
        <SidebarProvider style={{
            "--sidebar-width": "20rem" as string,
            "--sidebar-width-mobile": "20rem",
        } as SidebarProviderStyle}>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <NavMenu/>
                    <div className='-mr-1 ml-auto'>
                        <ModeToggle/>
                        <SidebarTrigger className="rotate-180"/>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min text-center">
                        <MapComponent/>
                    </div>
                </div>
            </SidebarInset>
            <AppSidebar side="right"/>
        </SidebarProvider>
    )
}
