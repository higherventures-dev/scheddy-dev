'use client';
import { Client } from '../ClientsTable';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';
import { formatPhoneNumber } from "@/lib/utils/formatPhoneNumber";
import { getReferralSource } from "@/lib/utils/getReferralSource";
import { ShowStatus } from '@/lib/utils/ShowStatus';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import type { ClientProfileWithSummary } from '@/lib/types/clientprofilewithsummary';
import BookingSummary from '@/components/clients/BookingSummary'  // wherever you put the client-side fetch component

interface Props {
  clientId: string
}

// const tabs = ['General', 'Bookings'];
const tabs = ['General'];

export function ViewClientForm({ initialData, onClose }: { initialData: Client; onClose: () => void }) {
  return (
      <div className="text-xs">
        <div>
          <Tab.Group>
              <Tab.List className="flex space-x-2 px-1 pt-2">
                {tabs.map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      clsx(
                        'px-3 py-1 text-xs rounded-md',
                        selected ? 'bg-[#3A3A3A] text-white' : 'bg-[#313131] text-white'
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="p-1 overflow-y-auto max-h-[calc(100vh-160px)]">
                <Tab.Panel>
                  {/* Tab 1: General Form */}
                  <div className="space-y-4 p-1 py-4 text-xs">

                      {/* Row 1: 1 column - Contact Information*/}
                      <h2 className="text-sm">Contact Information</h2>
                      {/* <div className="space-y-2 text-white">
                        <div><span className="text-[color:#969696]">Name:</span> {initialData.first_name}&nbsp;{initialData.last_name}</div>
                        <div> <PhoneIcon className="h-4 mr-2 text-[#969696]" /><span className="text-[color:#969696]">Phone:</span> {formatPhoneNumber(initialData.phone_number)}</div>
                        <div> <EnvelopeIcon className="h-4 mr-2 text-[#969696]" /><span className="text-[color:#969696]">Email:</span> {initialData.email_address}</div>
                      </div> */}

                      <div className="grid grid-rows-2 grid-cols-2 gap-4 ">
                        <div className="text-[#969696] flex">
                            <PhoneIcon className="h-4 mr-2 text-[#969696]" />
                            <span>Phone</span>
                        </div>
                        <div className="text-right">{formatPhoneNumber(initialData.phone_number)}</div>
                        <div className="text-[#969696] flex">
                            <EnvelopeIcon className="h-4 mr-2 text-[#969696]" />
                            <span>Email</span>
                        </div>
                        <div className="text-right">{initialData.email_address}</div>
                      </div>

                      <hr className="border-t border-[color:#3A3A3A]" />

                      {/* Row 2: 2 columns - Numbers */}
                      <BookingSummary clientId={initialData.id} />
                          
                      <h2 className="text-sm">Numbers</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#3A3A3A] p-4 rounded"><span className="text-2xl text-[color:#69AADE]">0</span><br></br>Bookings</div>
                        <div className="bg-[#3A3A3A]  p-4 rounded"><span className="text-2xl text-[color:#80cf93]">$0</span><br></br>Revenue</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#3A3A3A]  p-4 rounded"><span className="text-2xl text-[color:#FB6A58]">0</span><br></br>Canceled</div>
                        <div className="bg-[#3A3A3A]  p-4 rounded"><span className="text-2xl text-[color:#808080]">0</span><br></br>No Shows</div>
                      </div>
                      <hr className="border-t border-[color:#3A3A3A]" />
                      {/* Row 3: 1 column again - Notifications */}
                      <h2 className="text-sm">Notifications</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div><span className="text-[color:#969696]">Appointment notifications</span></div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <ShowStatus status={initialData.email_appointment_notification} text="Email" />
                            <ShowStatus status={initialData.text_appointment_notification} text="Text" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div><span className="text-[color:#969696]">Marketing notifications</span></div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <ShowStatus status={initialData.email_marketing_notification} text="Email" />
                            <ShowStatus status={initialData.text_marketing_notification} text="Text" />
                          </div>
                        </div>
                      </div>
                      <hr className="border-t border-[color:#3A3A3A]" />
                      {/* Repeat pattern - Deposits and cancellation */}
{/*                       <h2 className="text-sm">Deposits & Cancellations</h2>
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="text-white text-xs">
                              Upfront payments.&nbsp;
                              <span className=" text-[#969696]">
                                Client is asked to enter card details at the time of booking.
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="text-white text-xs">
                              Cancellation and no-show.&nbsp;
                              <span className=" text-[#969696]">
                                Client is not charged for no-shows and late cancellations.
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr className="border-t border-[color:#3A3A3A]" /> */}
                      <h2 className="text-sm">Additional Information</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div><span className="text-[color:#969696]">Occupation</span>&nbsp;{initialData.occupation}</div>
                        <div><span className="text-[color:#969696]">Client source</span>&nbsp;{getReferralSource(initialData.referral_source)}</div>
                        <div><span className="text-[color:#969696]">Additional phone</span>&nbsp;{formatPhoneNumber(initialData.phone_number_2)}</div>
                      </div>
                    </div>
                </Tab.Panel>

                <Tab.Panel>
                  {/* Tab 2: Bookings */}
                   <div className="space-y-2 p-1 py-4 text-xs">
                      <h2 className="text-sm">July</h2>
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
                  <hr className="border-t border-[color:#3A3A3A]" />
                  <div className="space-y-2 p-1 py-4 text-xs">
                      <h2 className="text-sm">July 2023</h2>
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
                </Tab.Panel>

                <Tab.Panel>
                   {/* Tab 3: Reviews */}
                   <div className="space-y-2 p-1 py-4 text-xs">
                      <h2 className="text-sm"></h2>
                      <div className=" bg-[#3A3A3A] p-1 rounded">
                        <div className="grid grid-cols-6 gap-1">
                          <div className="col-span-5 p-4">Austin Clark<br></br><span className="text-[#808080]">New Tattoo Session</span></div>
                          <div className="col-span-1 p-2"><div className="text-green-400 text-xs">
                              ★★★★★
                            </div>
                          </div>
                        </div>
                        <hr className="border-t border-[color:#808080]" />
                        <div className="grid grid-cols-1 gap-1 space-y-2 p-4 py-4 ">
                          As usual, top notch quality. Well done!<br></br>
                          <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 text-[#808080]" /><span className="p-1 text-[#808080]">2:15 PM - October 30, 2025
                            </span>
                          </div>
                        </div>
                       </div>
                  </div>
                          </Tab.Panel>
                          <Tab.Panel>
                             {/* Tab 4: Photos */}
                      <h2 className="text-xs text-[#808080] py-4 p-2">Photos are private and visible only to you; they won't be shared with your client.</h2>
                      <div className="grid grid-cols-2 gap-4 mb-4 p-2">
                        <img className="bg-[#3A3A3A] p-4 rounded" src="../assets/images/image23.png"/>
                        <img className="bg-[#3A3A3A] p-4 rounded" src="../assets/images/image24.png"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4 p-2">
                        <img className="bg-[#3A3A3A] p-4 rounded" src="../assets/images/image25.png"/>
                        <img className="bg-[#3A3A3A] p-4 rounded" src="../assets/images/image26.png"/>
                      </div>
               
                          </Tab.Panel>
                           <Tab.Panel>
                             {/* Tab 5: Notes */}
                              <h2 className="text-xs text-[#808080] py-4 p-2">Notes are private and visible only to you; they won't be shared with your client.</h2>
                   
                             <div className=" bg-[#3A3A3A] p-1 rounded mb-4">
                         <div className="grid grid-cols-1 gap-1 space-y-2 p-4 py-4 ">
                          <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 text-[#808080]" /><span className="p-1 text-[#808080]">2:15 PM - October 30, 2024
                            </span>
                            </div>
                            <span>
                              Mentioned high sensitivity on ribs and shoulders; recommended extra breaks for comfort.
                      
                          </span>
                        </div></div>

                        <div className=" bg-[#3A3A3A] p-1 rounded mb-4">
                         <div className="grid grid-cols-1 gap-1 space-y-2 p-4 py-4 ">
                          <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 text-[#808080]" /><span className="p-1 text-[#808080]">4:08 PM - October 28, 2024
                            </span>
                            </div>
                            <span>
                              Had some fading on a previous piece - suggested a touch-up plan for brighter longevity.
                      
                          </span>
                        </div></div>

               
                          </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
      </div>
      <div>
       <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 text-xs">
                    Close
                  </button>
                  </div>
                  </div>
                    );
}