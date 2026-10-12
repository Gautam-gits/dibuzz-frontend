import React from 'react';
import { Link } from 'react-router-dom';
import { Button, EmptyState, Spinner } from './ui';

export function PageLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  );
}

export function AccessPanel({ title, text, actionLabel, onAction }) {
  return (
    <EmptyState
      title={title}
      text={text}
      action={actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    />
  );
}

export function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      text="This page does not exist or has moved. You can browse our programs instead."
      action={<Button as={Link} to="/programs">Explore Programs</Button>}
    />
  );
}
