import Layout from 'app/components/Layout'
import { StreamRepresentation, VestingRepresentation } from 'app/features/context/representations'
import CreateStreamModal from 'app/features/stream/CreateStreamModal'
import { FuroTable, FuroTableType } from 'app/features/stream/FuroTable'
import CreateVestingModal from 'app/features/vesting/CreateVestingModal'
import { FC } from 'react'
import { Typography } from 'ui/typography'
import { getBuiltGraphSDK } from '../../../.graphclient'

interface DashboardProps {
  streams: { incomingStreams: StreamRepresentation[]; outgoingStreams: StreamRepresentation[] }
  vestings: { incomingVestings: VestingRepresentation[]; outgoingVestings: VestingRepresentation[] }
}
const Dashboard: FC<DashboardProps> = ({ streams, vestings }) => {
  return (
    <Layout>
      <div className="flex flex-col h-full gap-12 pt-40">
        <Typography variant="h2" weight={700} className="text-high-emphesis">
          Dashboard
        </Typography>
        <div className="flex gap-5">
          <CreateStreamModal />
          <CreateVestingModal />
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              Incoming
            </Typography>
            <FuroTable
              streams={streams.incomingStreams}
              vestings={vestings.incomingVestings}
              type={FuroTableType.INCOMING}
            />
          </div>
          <div className="flex flex-col gap-5">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              Outgoing
            </Typography>
            <FuroTable
              streams={streams.outgoingStreams}
              vestings={vestings.outgoingVestings}
              type={FuroTableType.OUTGOING}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  const streams = (await sdk.UserStreams({ id: query.address })).STREAM_user
  const vestings = (await sdk.UserVestings({ id: query.address })).VESTING_user
  return {
    props: {
      streams: streams || {},
      vestings: vestings || {},
    },
  }
}