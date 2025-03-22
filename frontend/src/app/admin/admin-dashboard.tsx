"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

interface VerificationRequest {
  id: string
  userId: string
  userName: string
  propertyName: string
  propertyAddress: string
  submissionDate: string
  status: "pending" | "reviewing" | "approved" | "rejected" | "flagged"
}

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<string>("all")

  // Mock verification requests data - in a real app, this would come from an API
  const verificationRequests: VerificationRequest[] = [
    {
      id: "req-1",
      userId: "user-123",
      userName: "John Doe",
      propertyName: "Beach House",
      propertyAddress: "123 Ocean Ave, Miami, FL 33139",
      submissionDate: "2025-03-18",
      status: "pending",
    },
    {
      id: "req-2",
      userId: "user-456",
      userName: "Alice Smith",
      propertyName: "Downtown Apartment",
      propertyAddress: "456 Main St, Apt 7B, New York, NY 10001",
      submissionDate: "2025-03-19",
      status: "reviewing",
    },
    {
      id: "req-3",
      userId: "user-789",
      userName: "Bob Johnson",
      propertyName: "Mountain Cabin",
      propertyAddress: "789 Pine Rd, Aspen, CO 81611",
      submissionDate: "2025-03-20",
      status: "flagged",
    },
    {
      id: "req-4",
      userId: "user-101",
      userName: "Emily Wilson",
      propertyName: "Suburban Home",
      propertyAddress: "101 Oak Dr, Austin, TX 78701",
      submissionDate: "2025-03-15",
      status: "rejected",
    },
    {
      id: "req-5",
      userId: "user-202",
      userName: "Michael Brown",
      propertyName: "Lake House",
      propertyAddress: "202 Lake View Dr, Seattle, WA 98101",
      submissionDate: "2025-03-17",
      status: "approved",
    },
    {
      id: "req-6",
      userId: "user-303",
      userName: "Sarah Lee",
      propertyName: "City Loft",
      propertyAddress: "303 Urban St, Chicago, IL 60601",
      submissionDate: "2025-03-21",
      status: "pending",
    },
  ]

  const approveRequest = (id: string) => {
    toast.success(`Request ${id} approved`)
  }

  const rejectRequest = (id: string) => {
    toast.success(`Request ${id} rejected`)
  }

  const flagRequest = (id: string) => {
    toast.success(`Request ${id} flagged for review`)
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const getStatusBadge = (status: VerificationRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>
      case "reviewing":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Reviewing</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>
      case "flagged":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Flagged</Badge>
      default:
        return null
    }
  }

  // Filter requests based on tab and search term
  const filteredRequests = verificationRequests
    .filter(request =>
      activeTab === "all" || request.status === activeTab
    )
    .filter(request =>
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verification Requests Overview</CardTitle>
          <CardDescription>
            View and manage property verification requests from users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={(value) => setActiveTab(value)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <TabsList className="grid grid-cols-3 md:grid-cols-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
                  <TabsTrigger value="flagged">Flagged</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      className="pl-8 w-[200px] md:w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button size="icon" variant="outline">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value={activeTab}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Request ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead className="w-[150px]">Submission Date</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No requests found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>{request.userName}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{request.propertyName}</div>
                                <div className="text-sm text-muted-foreground">{request.propertyAddress}</div>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(request.submissionDate)}</TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  asChild
                                >
                                  <a href={`/admin/requests/${request.id}`}>
                                    Review
                                  </a>
                                </Button>

                                {(request.status === "pending" || request.status === "reviewing" || request.status === "flagged") && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                                      onClick={() => approveRequest(request.id)}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                                      onClick={() => rejectRequest(request.id)}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}

                                {request.status === "pending" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20"
                                    onClick={() => flagRequest(request.id)}
                                  >
                                    Flag
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}