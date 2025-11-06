// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState, useEffect} from 'react'
import {FormattedMessage} from 'react-intl'

import {ActivityLogger, ActivityEvent} from './activityLog'
import ActivityEventComponent from './activityEvent'

import './activityPanel.scss'

type Props = {
    cardId: string
}

const ActivityPanel = (props: Props): JSX.Element => {
    const {cardId} = props
    const [events, setEvents] = useState<ActivityEvent[]>([])
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        loadEvents()
    }, [cardId])

    const loadEvents = () => {
        const loadedEvents = ActivityLogger.getEvents(cardId)
        setEvents(loadedEvents)
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    const displayedEvents = isExpanded ? events : events.slice(0, 5)
    const hasMoreEvents = events.length > 5

    return (
        <div className='ActivityPanel'>
            <div className='ActivityPanel__header'>
                <h3 className='ActivityPanel__title'>
                    <FormattedMessage
                        id='ActivityPanel.title'
                        defaultMessage='Activity'
                    />
                </h3>
                {events.length > 0 && (
                    <span className='ActivityPanel__count'>
                        {events.length}
                    </span>
                )}
            </div>

            {events.length === 0 ? (
                <div className='ActivityPanel__empty'>
                    <FormattedMessage
                        id='ActivityPanel.no-activity'
                        defaultMessage='No activity yet. Changes to this card will appear here.'
                    />
                </div>
            ) : (
                <>
                    <div className='ActivityPanel__events'>
                        {displayedEvents.map((event) => (
                            <ActivityEventComponent
                                key={event.id}
                                event={event}
                            />
                        ))}
                    </div>

                    {hasMoreEvents && !isExpanded && (
                        <button
                            className='ActivityPanel__show-more'
                            onClick={toggleExpanded}
                        >
                            <FormattedMessage
                                id='ActivityPanel.show-more'
                                defaultMessage='Show {count} more'
                                values={{count: events.length - 5}}
                            />
                        </button>
                    )}

                    {isExpanded && hasMoreEvents && (
                        <button
                            className='ActivityPanel__show-more'
                            onClick={toggleExpanded}
                        >
                            <FormattedMessage
                                id='ActivityPanel.show-less'
                                defaultMessage='Show less'
                            />
                        </button>
                    )}
                </>
            )}
        </div>
    )
}

export default ActivityPanel
