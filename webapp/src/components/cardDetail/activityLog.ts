// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export type ActivityEventType =
    | 'card_created'
    | 'title_changed'
    | 'property_changed'
    | 'content_added'
    | 'content_deleted'
    | 'comment_added'
    | 'attachment_added'

export interface ActivityEvent {
    id: string
    cardId: string
    type: ActivityEventType
    timestamp: number
    userId?: string
    metadata?: {
        propertyName?: string
        oldValue?: string
        newValue?: string
        contentType?: string
        [key: string]: any
    }
}

const ACTIVITY_STORAGE_KEY_PREFIX = 'focalboard_activity_'
const MAX_EVENTS_PER_CARD = 100

export class ActivityLogger {
    static logEvent(event: Omit<ActivityEvent, 'id' | 'timestamp'>): void {
        const fullEvent: ActivityEvent = {
            ...event,
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
        }

        const storageKey = `${ACTIVITY_STORAGE_KEY_PREFIX}${event.cardId}`
        const existingEvents = this.getEvents(event.cardId)

        const updatedEvents = [fullEvent, ...existingEvents].slice(0, MAX_EVENTS_PER_CARD)

        try {
            localStorage.setItem(storageKey, JSON.stringify(updatedEvents))
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to save activity event:', error)
        }
    }

    static getEvents(cardId: string): ActivityEvent[] {
        const storageKey = `${ACTIVITY_STORAGE_KEY_PREFIX}${cardId}`
        try {
            const data = localStorage.getItem(storageKey)
            if (!data) {
                return []
            }
            return JSON.parse(data) as ActivityEvent[]
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to load activity events:', error)
            return []
        }
    }

    static clearEvents(cardId: string): void {
        const storageKey = `${ACTIVITY_STORAGE_KEY_PREFIX}${cardId}`
        try {
            localStorage.removeItem(storageKey)
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to clear activity events:', error)
        }
    }
}
