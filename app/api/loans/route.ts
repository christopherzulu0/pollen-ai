import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth()

    if(!session || !session.userId === null){
      return NextResponse.json({error:"Not Authorized"},{status:401})
    }

    {/** Check if user exists in our database */}
    let dbUser = await prisma.user.findFirst({
      where: { 
        clerkUserId: session?.userId 
      }
    });

    if (!dbUser) {
      return NextResponse.json({error:"User not found"},{status:404})
    }

    const data = await req.json();

    {/** Validate the group exists and user is an ACTIVE member */}
    const membership = await prisma.membership.findFirst({
      where: {
        userId: dbUser.id,
        groupId: data.groupId,
        status: "ACTIVE" // Only active members can request loans
      }
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You must be an active member of this group to request a loan" },
        { status: 403 }
      )
    }

    // Create the loan request
    const newLoanRequest = await prisma.loanRequest.create({
      data: {
        amount: parseFloat(data.amount),
        purpose: data.purpose,
        repaymentDate: new Date(data.repaymentDate),
        repaymentTerms: data.repaymentTerms,
        installments: data.installments,
        interestRate: parseFloat(data.interestRate),
        status: "PENDING",
        userId: dbUser.id,
        groupId: data.groupId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        group: true
      }
    });

    // Create notifications for all ACTIVE group members (OWNER, ADMIN, MEMBER)
    const groupMembers = await prisma.membership.findMany({
      where: {
        groupId: data.groupId,
        status: "ACTIVE", // Only notify active members
        userId: {
          not: dbUser.id // Exclude the requester
        }
      },
      include: {
        user: true
      }
    });

    // Create notifications in a transaction
    await prisma.$transaction(
      groupMembers.map(member => 
        prisma.notification.create({
          data: {
            title: "New Loan Request",
            message: `${dbUser.name} has requested a loan of ${parseFloat(data.amount)} from your group.`,
            type: "LOAN_REQUEST",
            userId: member.userId,
            relatedGroupId: data.groupId,
            relatedLoanRequestId: newLoanRequest.id
          }
        })
      )
    );

    return NextResponse.json(newLoanRequest);
  } catch (error) {
    console.error("Error creating loan request:", error);
    return NextResponse.json(
      { error: "Failed to create loan request" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {

  try {
    const session = await auth()

    if(!session || !session.userId === null){
      return NextResponse.json({error:"Not Authorized"},{status:401})
    }

    // Get the URL and parse query parameters
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab');
    const groupId = searchParams.get('groupId');
    const status = searchParams.get('status');

    // Check if user exists in our database
    let dbUser = await prisma.user.findFirst({
      where: { 
        clerkUserId: session?.userId 
      }
    });

    if (!dbUser) {
      return NextResponse.json({error:"User not found"},{status:404})
    }

    let loanRequests;

    // Different queries based on the tab parameter
    if (tab === 'my-requests') {
      // Get loan requests made by the current user
      loanRequests = await prisma.loanRequest.findMany({
        where: {
          userId: dbUser.id
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          group: true,
          votes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (tab === 'pending') {
      // Get pending loan requests for groups where the user is an ACTIVE member (any role: OWNER, ADMIN, or MEMBER)
      const userMemberships = await prisma.membership.findMany({
        where: {
          userId: dbUser.id,
          status: "ACTIVE" // Only active memberships
        },
        select: {
          groupId: true,
          role: true
        }
      });

      const groupIds = userMemberships.map(m => m.groupId);

      if (groupIds.length === 0) {
        return NextResponse.json([]);
      }

      loanRequests = await prisma.loanRequest.findMany({
        where: {
          groupId: {
            in: groupIds
          },
          status: "PENDING"
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          group: true,
          votes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (groupId) {
      // Get loan requests for a specific group (only if user is an ACTIVE member)
      const membership = await prisma.membership.findFirst({
        where: {
          userId: dbUser.id,
          groupId: groupId,
          status: "ACTIVE" // Only active members
        }
      });

      if (!membership) {
        return NextResponse.json(
          { error: "You must be an active member of this group to view loan requests" },
          { status: 403 }
        );
      }

      loanRequests = await prisma.loanRequest.findMany({
        where: {
          groupId: groupId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          group: true,
          votes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (status) {
      // Get loan requests with specific status for groups where the user is an ACTIVE member (any role: OWNER, ADMIN, or MEMBER)
      const userMemberships = await prisma.membership.findMany({
        where: {
          userId: dbUser.id,
          status: "ACTIVE" // Only active memberships
        },
        select: {
          groupId: true,
          role: true
        }
      });

      const groupIds = userMemberships.map(m => m.groupId);

      if (groupIds.length === 0) {
        return NextResponse.json([]);
      }

      loanRequests = await prisma.loanRequest.findMany({
        where: {
          groupId: {
            in: groupIds
          },
          status: status
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          group: true,
          votes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // Get all loan requests for groups where the user is an ACTIVE member (any role: OWNER, ADMIN, or MEMBER)
      const userMemberships = await prisma.membership.findMany({
        where: {
          userId: dbUser.id,
          status: "ACTIVE" // Only active memberships
        },
        select: {
          groupId: true,
          role: true
        }
      });

      const groupIds = userMemberships.map(m => m.groupId);

      if (groupIds.length === 0) {
        return NextResponse.json([]);
      }

      loanRequests = await prisma.loanRequest.findMany({
        where: {
          groupId: {
            in: groupIds
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          group: true,
          votes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    // Calculate total members for each loan request and check if user has voted
    const loanRequestsWithTotalMembers = await Promise.all(
      loanRequests.map(async (loan) => {
        const totalMembers = await prisma.membership.count({
          where: {
            groupId: loan.groupId,
            status: "ACTIVE"
          }
        });

        // Check if the current user has already voted on this loan request
        const userHasVoted = loan.votes.some(vote => vote.user.id === dbUser.id);

        // If the user has voted, get their vote value
        let userVote = null;
        if (userHasVoted) {
          const userVoteObj = loan.votes.find(vote => vote.user.id === dbUser.id);
          if (userVoteObj) {
            userVote = userVoteObj.vote;
          }
        }

        return {
          ...loan,
          totalMembers,
          userHasVoted,
          userVote
        };
      })
    );

    return NextResponse.json(loanRequestsWithTotalMembers);
  } catch (error) {
    console.error("Error fetching loan requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch loan requests" },
      { status: 500 }
    );
  }
}

// API endpoint to vote on a loan request
export async function PATCH(req: Request) {

  try {
    const session = await auth()

    if(!session || !session.userId === null){
      return NextResponse.json({error:"Not Authorized"},{status:401})
    }

    const data = await req.json();
    const { loanRequestId, vote, comment } = data;

    // Check if user exists in our database
    let dbUser = await prisma.user.findFirst({
      where: { 
        clerkUserId: session?.userId 
      }
    });

    if (!dbUser) {
      return NextResponse.json({error:"User not found"},{status:404})
    }

    // Get the loan request
    const loanRequest = await prisma.loanRequest.findUnique({
      where: {
        id: loanRequestId
      },
      include: {
        group: true
      }
    });

    if (!loanRequest) {
      return NextResponse.json({error:"Loan request not found"},{status:404})
    }

    // Check if user is an ACTIVE member of the group (OWNER, ADMIN, or MEMBER can vote)
    const membership = await prisma.membership.findFirst({
      where: {
        userId: dbUser.id,
        groupId: loanRequest.groupId,
        status: "ACTIVE" // Only active members can vote
      }
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You must be an active member of this group to vote on loan requests" },
        { status: 403 }
      )
    }

    // Check if user has already voted
    const existingVote = await prisma.loanVote.findUnique({
      where: {
        userId_loanRequestId: {
          userId: dbUser.id,
          loanRequestId
        }
      }
    });

    if (existingVote) {
      // Update existing vote
      const updatedVote = await prisma.loanVote.update({
        where: {
          id: existingVote.id
        },
        data: {
          vote,
          comment
        }
      });

      // Fetch the updated loan request with all votes to return to the client
      const updatedLoanRequest = await prisma.loanRequest.findUnique({
        where: {
          id: loanRequestId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          group: true,
          votes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          }
        }
      });

      // Get total members count
      const totalMembers = await prisma.membership.count({
        where: {
          groupId: updatedLoanRequest.groupId,
          status: "ACTIVE"
        }
      });

      // Return the complete loan request with votes data and total members
      return NextResponse.json({
        vote: updatedVote,
        loanRequest: updatedLoanRequest,
        totalMembers: totalMembers
      });
    }

    // Create new vote
    const newVote = await prisma.loanVote.create({
      data: {
        vote,
        comment,
        userId: dbUser.id,
        loanRequestId,
        membershipId: membership.id
      }
    });

    // Get all votes for this loan request
    const allVotes = await prisma.loanVote.findMany({
      where: {
        loanRequestId
      }
    });

    const totalMembers = await prisma.membership.count({
      where: {
        groupId: loanRequest.groupId,
        status: "ACTIVE"
      }
    });

    // Calculate majority threshold: floor(totalMembers / 2) + 1
    const majorityThreshold = Math.floor(totalMembers / 2) + 1;
    const approvalVotes = allVotes.filter(v => v.vote).length;
    const rejectionVotes = allVotes.filter(v => !v.vote).length;

    // Update status when majority is reached (not waiting for all votes)
    if (approvalVotes >= majorityThreshold) {
      // Majority approved
      const currentStatus = await prisma.loanRequest.findUnique({
        where: { id: loanRequestId },
        select: { status: true }
      });

      // Only process if not already approved (prevent duplicate processing)
      if (currentStatus?.status !== "APPROVED") {
        // Update loan request status to APPROVED
        const approvedLoan = await prisma.loanRequest.update({
          where: {
            id: loanRequestId
          },
          data: {
            status: "APPROVED"
          },
          include: {
            user: true,
            group: true
          }
        });

        // Get the user's wallet
        const userWallet = await prisma.wallet.findUnique({
          where: {
            userId: loanRequest.userId
          }
        });

        if (!userWallet) {
          console.error(`User wallet not found for user ID: ${loanRequest.userId}`);
        } else {
          // Credit the loan amount to the user's wallet
          await prisma.wallet.update({
            where: {
              id: userWallet.id
            },
            data: {
              balance: {
                increment: loanRequest.amount
              }
            }
          });

          // Create a transaction record for the loan disbursement
          await prisma.transaction.create({
            data: {
              amount: loanRequest.amount,
              type: "LOAN_DISBURSEMENT",
              status: "COMPLETED",
              userId: loanRequest.userId,
              walletId: userWallet.id,
              groupId: loanRequest.groupId,
              description: `Loan approved from ${approvedLoan.group.name}`
            }
          });

          // Deduct the loan amount from the group's contributions
          // This is done by updating the group's total contribution amount
          await prisma.membership.update({
            where: {
              userId_groupId: {
                userId: loanRequest.userId,
                groupId: loanRequest.groupId
              }
            },
            data: {
              totalContributed: {
                decrement: loanRequest.amount
              }
            }
          });
        }

        // Notify the requester
        await prisma.notification.create({
          data: {
            title: "Loan Request Approved",
            message: `Your loan request for ${loanRequest.amount} has been approved.`,
            type: "LOAN_APPROVED",
            userId: loanRequest.userId,
            relatedGroupId: loanRequest.groupId,
            relatedLoanRequestId: loanRequestId
          }
        });
      } else if (approvalVotes < rejectionVotes) {
        await prisma.loanRequest.update({
          where: {
            id: loanRequestId
          },
          data: {
            status: "REJECTED"
          }
        });

        // Notify the requester
        await prisma.notification.create({
          data: {
            title: "Loan Request Rejected",
            message: `Your loan request for ${loanRequest.amount} has been rejected.`,
            type: "LOAN_REJECTED",
            userId: loanRequest.userId,
            relatedGroupId: loanRequest.groupId,
            relatedLoanRequestId: loanRequestId
          }
        });
      } else {
        // Votes are tied
        await prisma.loanRequest.update({
          where: {
            id: loanRequestId
          },
          data: {
            status: "PENDING"
          }
        });

        // Notify the requester
        await prisma.notification.create({
          data: {
            title: "Loan Request Voting Tied",
            message: `Your loan request for ${loanRequest.amount} has resulted in a tie. The request will remain pending.`,
            type: "LOAN_REQUEST",
            userId: loanRequest.userId,
            relatedGroupId: loanRequest.groupId,
            relatedLoanRequestId: loanRequestId
          }
        });
      }
    }

    // Fetch the updated loan request with all votes to return to the client
    const updatedLoanRequest = await prisma.loanRequest.findUnique({
      where: {
        id: loanRequestId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        group: true,
        votes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    // Return the complete loan request with votes data and total members
    return NextResponse.json({
      vote: newVote,
      loanRequest: updatedLoanRequest,
      totalMembers: totalMembers
    });
  } catch (error) {
    console.error("Error voting on loan request:", error);
    return NextResponse.json(
      { error: "Failed to vote on loan request" },
      { status: 500 }
    );
  }
}
