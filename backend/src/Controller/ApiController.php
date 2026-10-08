<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\ConstraintViolationListInterface;

abstract class ApiController extends AbstractController
{
    protected function validationErrors(ConstraintViolationListInterface $errors): JsonResponse
    {
        $details = [];

        foreach ($errors as $error) {
            $details[$error->getPropertyPath()][] = $error->getMessage();
        }

        return $this->json([
            'message' => 'Dados inválidos.',
            'errors' => $details,
        ], 422);
    }

    protected function body(string $raw): array
    {
        if ($raw === '') {
            return [];
        }

        $data = json_decode($raw, true);

        if (!is_array($data)) {
            throw new \InvalidArgumentException('JSON inválido.');
        }

        return $data;
    }
}
