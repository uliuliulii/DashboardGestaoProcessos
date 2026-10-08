import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it('renderiza o status formatado', () => {
    render(<StatusBadge value="EM_ANDAMENTO" />)
    expect(screen.getByText('EM ANDAMENTO')).toBeTruthy()
  })
})
