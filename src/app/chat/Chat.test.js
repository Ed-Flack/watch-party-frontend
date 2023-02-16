import React from 'react';
import '@testing-library/jest-dom';
import {getByText, render, screen} from '@testing-library/react';
import Chat from "./Chat";

describe('Chat', () => {
    it('can render one message', () => {
        const messageHistory = [];
        messageHistory.push({
            name: 'Adam',
            id: '1',
            message: 'Hello',
            time: '12:00'
        });
        render(<Chat messageHistory={messageHistory} myId={'1'} darkMode={true}/>);
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('can render one message and assert other no other is present', () => {
        const messageHistory = [];
        messageHistory.push({
            name: 'Adam',
            id: '1',
            message: 'Hello',
            time: '12:00'
        });
        render(<Chat messageHistory={messageHistory} myId={'1'} darkMode={true}/>);
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Adam - 12:00')).toBeInTheDocument();
        expect(() => getByText('Hi')).toThrow();
    });

    it('can render multiple messages', () => {
        const messageHistory = [];
        messageHistory.push({
            name: 'Adam',
            id: '1',
            message: 'Hello',
            time: '12:00'
        });
        messageHistory.push({
            name: 'Brian',
            id: '2',
            message: 'Hi',
            time: '12:01'
        });
        render(<Chat messageHistory={messageHistory} myId={'1'} darkMode={true}/>);
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Adam - 12:00')).toBeInTheDocument();
        expect(screen.getByText('Hi')).toBeInTheDocument();
        expect(screen.getByText('Brian - 12:01')).toBeInTheDocument();
    });

    it('can render only messages from list', () => {
        const messageHistory = [];
        messageHistory.push({
            name: 'Adam',
            id: '1',
            message: 'Hello',
            time: '12:00'
        });
        messageHistory.push({
            name: 'Brian',
            id: '2',
            message: 'Hi',
            time: '12:01'
        });
        render(<Chat messageHistory={messageHistory} myId={'1'} darkMode={true}/>);
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Adam - 12:00')).toBeInTheDocument();
        expect(screen.getByText('Hi')).toBeInTheDocument();
        expect(screen.getByText('Brian - 12:01')).toBeInTheDocument();
        expect(() => getByText('Hola')).toThrow();
    });

    it('check id is correctly calculated for user\'s message', () => {
        const messageHistory = [];
        messageHistory.push({
            name: 'Adam',
            id: '1',
            message: 'Hello',
            time: '12:00'
        });
        render(<Chat messageHistory={messageHistory} myId={'1'} darkMode={true}/>);
        expect(screen.getByTestId('you')).toBeInTheDocument();
        expect(() => getByText('partner')).toThrow();
    });

    it('check id is correctly calculated for partner\'s message', () => {
        const messageHistory = [];
        messageHistory.push({
            name: 'Brian',
            id: '2',
            message: 'Hi',
            time: '12:01'
        });
        render(<Chat messageHistory={messageHistory} myId={'1'} darkMode={true}/>);
        expect(screen.getByTestId('partner')).toBeInTheDocument();
        expect(() => getByText('you')).toThrow();
    });

    it('check id is correctly calculated for both user\'s message', () => {
        const messageHistory = [];
        messageHistory.push({
            name: 'Adam',
            id: '1',
            message: 'Hello',
            time: '12:00'
        });
        messageHistory.push({
            name: 'Brian',
            id: '2',
            message: 'Hi',
            time: '12:01'
        });
        render(<Chat messageHistory={messageHistory} myId={'1'} darkMode={true}/>);
        expect(screen.getByTestId('you')).toBeInTheDocument();
        expect(screen.getByTestId('partner')).toBeInTheDocument();
    });
});