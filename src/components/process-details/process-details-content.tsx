"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProcessDataTab } from "./process-data-tab"
import { PartiesTab } from "./parties-tab"
import { DeadlinesTab } from "./deadlines-tab"
import { RelatedProcessesTab } from "./related-processes-tab"
import { HistoryTab } from "./history-tab"
import { ProcessHeader } from "./process-header"
import { ProcessFooter } from "./process-footer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/utils/cn"
import { useProcessDetails } from "@/hooks/useProcessDetails"

export function ProcessDetailsContent() {
  const { activeTab, setActiveTab, tabs } = useProcessDetails()

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto p-4 lg:p-6 space-y-6">
            <ProcessHeader />
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="space-y-6"
            >
              <div className="sticky top-0 z-10 bg-white border-b">
                <TabsList className="relative h-auto p-0 bg-transparent overflow-x-auto flex whitespace-nowrap">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={cn(
                        "relative h-12 rounded-none px-4",
                        "text-gray-500 hover:text-gray-900",
                        "data-[state=active]:text-[#0146cf]",
                        "data-[state=active]:font-medium",
                        "transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0146cf] focus-visible:ring-offset-2",
                        "disabled:pointer-events-none disabled:opacity-50"
                      )}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0146cf]" 
                          style={{ 
                            transform: 'scaleX(0.8)',
                            transition: 'transform 200ms ease'
                          }} 
                        />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="mt-4">
                <TabsContent value="dados">
                  <ProcessDataTab />
                </TabsContent>
                
                <TabsContent value="partes">
                  <PartiesTab />
                </TabsContent>
                
                <TabsContent value="prazos">
                  <DeadlinesTab />
                </TabsContent>
                
                <TabsContent value="relacionados">
                  <RelatedProcessesTab />
                </TabsContent>
                
                <TabsContent value="historico">
                  <HistoryTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
      <ProcessFooter />
    </div>
  )
} 