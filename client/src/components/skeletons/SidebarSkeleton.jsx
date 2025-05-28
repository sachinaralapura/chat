import React from "react";

function SidebarSkeleton() {
    return (
        <div className="flex w-20 lg:w-72 flex-col gap-4 p-4">
            <div className="flex items-center gap-4">
                <div className="skeleton lg:h-16 lg:w-16 shrink-0 rounded-full"></div>
                <div className="flex flex-col gap-4">
                    <div className="skeleton h-4 w-5 lg:w-20 "></div>
                    <div className="skeleton h-4 w-8 lg:w-28"></div>
                </div>
            </div>
            {/* <div className="skeleton h-32 w-full"></div> */}
        </div>
    );
}

export default SidebarSkeleton;
