import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { address, network } = await req.json()

    if (!address || !network) {
      return NextResponse.json(
        { error: 'Address and network are required' },
        { status: 400 }
      )
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    // Get or create wallet for user
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (wallet) {
      // Update existing wallet
      wallet = await prisma.wallet.update({
        where: { userId },
        data: {
          celoAddress: address,
          network: network,
          isConnected: true,
          connectedAt: new Date(),
        },
      })
    } else {
      // Create new wallet
      wallet = await prisma.wallet.create({
        data: {
          userId,
          celoAddress: address,
          network: network,
          isConnected: true,
          connectedAt: new Date(),
          balance: 0,
        },
      })
    }

    return NextResponse.json({
      success: true,
      wallet: {
        celoAddress: wallet.celoAddress,
        network: wallet.network,
        isConnected: wallet.isConnected,
      },
    })
  } catch (error: any) {
    console.error('Error connecting wallet:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to connect wallet' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: {
        celoAddress: true,
        network: true,
        isConnected: true,
        connectedAt: true,
      },
    })

    return NextResponse.json({
      wallet: wallet || null,
    })
  } catch (error: any) {
    console.error('Error fetching wallet:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wallet' },
      { status: 500 }
    )
  }
}

