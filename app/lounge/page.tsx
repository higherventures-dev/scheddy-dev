export default function LoungePage() {
    return (    
        <div className="p-8">
             <h1 className="text-lg">Welcome [ first name ]</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            <div className="space-y-2 p-1 py-4 text-xs">
                <div className=" bg-[#3A3A3A] p-1 rounded">
                <div className="grid grid-cols-6 gap-1">
                    <div className="col-span-1 p-4">JUL<br></br>17</div>
                    <div className="col-span-3 p-4">Wednesday, July 17<br></br><span className="text-[#808080]">9:00 AM - 11:00 AM</span></div>
                    <div className="col-span-2 p-4">Confirmed</div>
                </div>
                <div className="grid grid-cols-6 gap-1">
                    <div className="col-span-1 p-4"></div>
                    <div className="col-span-3 p-4">Continuing Session<br></br><span className="text-[#808080]">2 hours - Austin Clark</span></div>
                    <div className="col-span-2 p-4">$120.00</div>
                </div>
                </div>
            </div>

            <div className="space-y-2 p-1 py-4 text-xs">
                <div className=" bg-[#3A3A3A] p-1 rounded">
                <div className="grid grid-cols-6 gap-1">
                    <div className="col-span-1 p-4">JUL<br></br>18</div>
                    <div className="col-span-3 p-4">Thursday, July 18<br></br><span className="text-[#808080]">9:00 AM - 11:00 AM</span></div>
                    <div className="col-span-2 p-4">Unconfirmed</div>
                </div>
                <div className="grid grid-cols-6 gap-1">
                    <div className="col-span-1 p-4"></div>
                    <div className="col-span-3 p-4">Continuing Session<br></br><span className="text-[#808080]">2 hours - Austin Clark</span></div>
                    <div className="col-span-2 p-4">$120.00</div>
                </div>
                </div>
            </div>
            <div className="space-y-2 p-1 py-4 text-xs">
                <div className=" bg-[#3A3A3A] p-1 rounded">
                <div className="grid grid-cols-6 gap-1">
                    <div className="col-span-1 p-4">JUL<br></br>7</div>
                    <div className="col-span-3 p-4">Monday, July 7<br></br><span className="text-[#808080]">9:00 AM - 11:00 AM</span></div>
                    <div className="col-span-2 p-4">Completed</div>
                </div>
                <div className="grid grid-cols-6 gap-1">
                    <div className="col-span-1 p-4"></div>
                    <div className="col-span-3 p-4">Continuing Session<br></br><span className="text-[#808080]">2 hours - Austin Clark</span></div>
                    <div className="col-span-2 p-4">$340.00</div>
                </div>
                </div>
            </div>
        </div>
         </div>
    );
}