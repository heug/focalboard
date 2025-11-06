// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react'
import {useIntl} from 'react-intl'

import {ActivityEvent} from './activityLog'

import './activityEvent.scss'

type Props = {
    event: ActivityEvent
}

const ActivityEventComponent = (props: Props): JSX.Element => {
    const {event} = props
    const intl = useIntl()

    const getEventIcon = (): string => {
        switch (event.type) {
        case 'card_created':
            return '✨'
        case 'title_changed':
            return '✏️'
        case 'property_changed':
            return '🔄'
        case 'content_added':
            return '➕'
        case 'content_deleted':
            return '🗑️'
        case 'comment_added':
            return '💬'
        case 'attachment_added':
            return '📎'
        default:
            return '•'
        }
    }

    const getEventDescription = (): string => {
        switch (event.type) {
        case 'card_created':
            return intl.formatMessage({
                id: 'ActivityEvent.card-created',
                defaultMessage: 'Card created',
            })
        case 'title_changed':
            return intl.formatMessage({
                id: 'ActivityEvent.title-changed',
                defaultMessage: 'Title changed',
            })
        case 'property_changed': {
            const propertyName = event.metadata?.propertyName || intl.formatMessage({
                id: 'ActivityEvent.unknown-property',
                defaultMessage: 'property',
            })
            return intl.formatMessage({
                id: 'ActivityEvent.property-changed',
                defaultMessage: '{propertyName} changed',
            }, {propertyName})
        }
        case 'content_added':
            return intl.formatMessage({
                id: 'ActivityEvent.content-added',
                defaultMessage: 'Content added',
            })
        case 'content_deleted':
            return intl.formatMessage({
                id: 'ActivityEvent.content-deleted',
                defaultMessage: 'Content deleted',
            })
        case 'comment_added':
            return intl.formatMessage({
                id: 'ActivityEvent.comment-added',
                defaultMessage: 'Comment added',
            })
        case 'attachment_added':
            return intl.formatMessage({
                id: 'ActivityEvent.attachment-added',
                defaultMessage: 'Attachment added',
            })
        default:
            return intl.formatMessage({
                id: 'ActivityEvent.unknown',
                defaultMessage: 'Activity',
            })
        }
    }

    const getTimeAgo = (): string => {
        const now = Date.now()
        const diff = now - event.timestamp
        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) {
            return intl.formatMessage({
                id: 'ActivityEvent.days-ago',
                defaultMessage: '{days}d ago',
            }, {days})
        }
        if (hours > 0) {
            return intl.formatMessage({
                id: 'ActivityEvent.hours-ago',
                defaultMessage: '{hours}h ago',
            }, {hours})
        }
        if (minutes > 0) {
            return intl.formatMessage({
                id: 'ActivityEvent.minutes-ago',
                defaultMessage: '{minutes}m ago',
            }, {minutes})
        }
        return intl.formatMessage({
            id: 'ActivityEvent.just-now',
            defaultMessage: 'Just now',
        })
    }

    const getValueChange = (): JSX.Element | null => {
        if (event.type === 'property_changed' && event.metadata?.oldValue && event.metadata?.newValue) {
            return (
                <div className='ActivityEvent__value-change'>
                    <span className='ActivityEvent__old-value'>{event.metadata.oldValue}</span>
                    <span className='ActivityEvent__arrow'>{'→'}</span>
                    <span className='ActivityEvent__new-value'>{event.metadata.newValue}</span>
                </div>
            )
        }
        return null
    }

    return (
        <div className='ActivityEvent'>
            <div className='ActivityEvent__icon'>{getEventIcon()}</div>
            <div className='ActivityEvent__content'>
                <div className='ActivityEvent__description'>{getEventDescription()}</div>
                {getValueChange()}
                <div className='ActivityEvent__timestamp'>{getTimeAgo()}</div>
            </div>
        </div>
    )
}

export default ActivityEventComponent
