
import { useNavigate } from 'react-router-dom';
import { DocumentTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

// Define the type of verification status
type VerificationType = 'pending' | 'all';

// Props for the component
interface VerificationStatusProps {
  type: VerificationType;
}

// Define the shape of a verification entry
interface VerificationEntry {
  id: string;
  propertyAddress: string;
  documentType: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  reviewDate?: string;
}

function VerificationStatus({ type }: VerificationStatusProps) {
  const navigate = useNavigate();
  
  // Mock verification data
  const verifications: VerificationEntry[] = [
    {
      id: 'v1',
      propertyAddress: '123 Main St, Anytown, USA',
      documentType: 'Deed',
      submittedDate: '2025-03-15',
      status: 'pending'
    },
    {
      id: 'v2',
      propertyAddress: '456 Oak Ave, Somewhere, USA',
      documentType: 'Title Insurance',
      submittedDate: '2025-03-10',
      status: 'approved',
      reviewDate: '2025-03-18',
      notes: 'All documents verified successfully.'
    },
    {
      id: 'v3',
      propertyAddress: '789 Pine Rd, Nowhere, USA',
      documentType: 'Property Tax Record',
      submittedDate: '2025-03-05',
      status: 'rejected',
      reviewDate: '2025-03-12',
      notes: 'Document appears to be outdated. Please submit current year records.'
    }
  ];
  
  // Filter verifications based on the type
  const filteredVerifications = type === 'pending' 
    ? verifications.filter(v => v.status === 'pending')
    : verifications;
  
  // Get status badge component based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rustyred bg-opacity-10 text-rustyred">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };
  
  // Handle click to add new property verification
  const handleAddProperty = () => {
    navigate('/property/verify');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-graphite font-florssolid">
          {type === 'pending' ? 'Pending Verifications' : 'All Verifications'}
        </h2>
        <button
          onClick={handleAddProperty}
          className="px-4 py-2 bg-graphite text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
        >
          Verify New Property
        </button>
      </div>
      
      {filteredVerifications.length === 0 ? (
        <div className="bg-milk rounded-lg shadow-sm p-8 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-lightstone" />
          <h3 className="mt-4 text-lg font-medium text-graphite">No verifications found</h3>
          <p className="mt-1 text-gray-500">
            {type === 'pending' 
              ? 'You have no pending verification requests.'
              : 'You haven\'t submitted any property verifications yet.'}
          </p>
          <button
            onClick={handleAddProperty}
            className="mt-4 px-4 py-2 bg-graphite text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
          >
            Start Verification
          </button>
        </div>
      ) : (
        <div className="bg-milk rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-lightstone">
              <thead className="bg-lightstone bg-opacity-30">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-lightstone divide-opacity-50">
                {filteredVerifications.map((verification) => (
                  <tr key={verification.id} className="hover:bg-milk">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-graphite">
                      {verification.propertyAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {verification.documentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(verification.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(verification.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-graphite hover:text-opacity-70">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Details section for most recent verification */}
          {type === 'all' && (
            <div className="p-6 border-t border-lightstone bg-white">
              <h3 className="text-lg font-medium text-graphite mb-2">Verification Details</h3>
              
              {filteredVerifications.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Property</h4>
                    <p className="mt-1 text-graphite">{filteredVerifications[0].propertyAddress}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Document Type</h4>
                    <p className="mt-1 text-graphite">{filteredVerifications[0].documentType}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Submitted Date</h4>
                    <p className="mt-1 text-graphite">
                      {new Date(filteredVerifications[0].submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <div className="mt-1">{getStatusBadge(filteredVerifications[0].status)}</div>
                  </div>
                  
                  {filteredVerifications[0].reviewDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Review Date</h4>
                      <p className="mt-1 text-graphite">
                        {new Date(filteredVerifications[0].reviewDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  {filteredVerifications[0].notes && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                      <p className="mt-1 text-graphite">{filteredVerifications[0].notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Verification timeline - visible only in "all" view */}
      {type === 'all' && filteredVerifications.length > 0 && (
        <div className="bg-milk rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-graphite mb-4">Verification Timeline</h3>
          
          <div className="flow-root">
            <ul className="-mb-8">
              {filteredVerifications.map((verification, index) => (
                <li key={verification.id}>
                  <div className="relative pb-8">
                    {index !== filteredVerifications.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-lightstone" aria-hidden="true"></span>
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          verification.status === 'approved' ? 'bg-green-100' :
                          verification.status === 'rejected' ? 'bg-rustyred bg-opacity-10' :
                          'bg-amber-100'
                        }`}>
                          {verification.status === 'approved' ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-800" />
                          ) : verification.status === 'rejected' ? (
                            <XCircleIcon className="h-5 w-5 text-rustyred" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-amber-800" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-graphite font-medium">
                            {verification.documentType} for {verification.propertyAddress}
                          </p>
                          {verification.notes && (
                            <p className="mt-1 text-sm text-gray-500">
                              {verification.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={verification.submittedDate}>
                            {new Date(verification.submittedDate).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerificationStatus;