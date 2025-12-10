// app/api/teams/route.ts
// Complete team collaboration system for Enterprise tier

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''


// Get user's teams
export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
    if (!supabase) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
    }

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get teams where user is a member
    const { data: teams, error } = await supabase
      .from('team_members')
      .select(`
        team_id,
        role,
        teams:team_id (
          id,
          name,
          owner_id,
          subscription_tier,
          created_at
        )
      `)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true, data: teams })
  } catch (error: unknown) {
    console.error('Get teams error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get teams' },
      { status: 500 }
    )
  }
}

// Create new team
export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
    if (!supabase) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
    }

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has enterprise subscription
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    if (userData?.subscription_tier !== 'enterprise') {
      return NextResponse.json(
        { error: 'Enterprise subscription required to create teams' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
    }

    // Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name,
        owner_id: user.id,
        subscription_tier: 'enterprise',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (teamError) throw teamError

    // Add creator as owner
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner',
        joined_at: new Date().toISOString(),
      })

    if (memberError) throw memberError

    return NextResponse.json({ success: true, data: team })
  } catch (error: unknown) {
    console.error('Create team error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create team' },
      { status: 500 }
    )
  }
}

// Invite member to team
export async function PUT(request: NextRequest) {
  try {
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
    if (!supabase) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
    }

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { teamId, email, role = 'member' } = body

    if (!teamId || !email) {
      return NextResponse.json({ error: 'Team ID and email are required' }, { status: 400 })
    }

    // Check if user is admin or owner of the team
    const { data: membership } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single()

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Find user by email
    const { data: invitedUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (!invitedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Add to team
    const { data: newMember, error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: invitedUser.id,
        role,
        invited_by: user.id,
        joined_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (memberError) throw memberError

    // TODO: Send invitation email

    return NextResponse.json({ success: true, data: newMember })
  } catch (error: unknown) {
    console.error('Invite member error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to invite member' },
      { status: 500 }
    )
  }
}

// Comments API
export async function PATCH(request: NextRequest) {
  try {
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
    if (!supabase) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
    }

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, projectId, commentId, content, parentId } = body

    if (action === 'add') {
      // Add comment
      const { data: comment, error } = await supabase
        .from('project_comments')
        .insert({
          project_id: projectId,
          user_id: user.id,
          parent_id: parentId || null,
          content,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, data: comment })
    } else if (action === 'list') {
      // List comments
      const { data: comments, error } = await supabase
        .from('project_comments')
        .select(`
          *,
          user:users!user_id (
            id,
            name,
            email
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return NextResponse.json({ success: true, data: comments })
    } else if (action === 'delete') {
      // Delete comment
      const { error } = await supabase
        .from('project_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: unknown) {
    console.error('Comment error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Comment operation failed' },
      { status: 500 }
    )
  }
}

// app/api/approvals/route.ts
export async function approvalPOST(request: NextRequest) {
  try {
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
    if (!supabase) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
    }

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, projectId, approverId, approvalId, status, comments } = body

    if (action === 'request') {
      // Request approval
      const { data: approval, error } = await supabase
        .from('approvals')
        .insert({
          project_id: projectId,
          requested_by: user.id,
          approver_id: approverId,
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // TODO: Send notification to approver

      return NextResponse.json({ success: true, data: approval })
    } else if (action === 'respond') {
      // Approve or reject
      const { data: approval, error } = await supabase
        .from('approvals')
        .update({
          status,
          comments,
          updated_at: new Date().toISOString(),
        })
        .eq('id', approvalId)
        .eq('approver_id', user.id)
        .select()
        .single()

      if (error) throw error

      // TODO: Notify requester

      return NextResponse.json({ success: true, data: approval })
    } else if (action === 'list') {
      // List approvals for project
      const { data: approvals, error } = await supabase
        .from('approvals')
        .select(`
          *,
          requester:users!requested_by (name, email),
          approver:users!approver_id (name, email)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return NextResponse.json({ success: true, data: approvals })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: unknown) {
    console.error('Approval error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Approval operation failed' },
      { status: 500 }
    )
  }
}