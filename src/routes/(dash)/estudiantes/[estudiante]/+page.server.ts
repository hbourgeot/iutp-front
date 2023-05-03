import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals:{client}, params}) => {
    const {ok, data} = await client.GET(`/api/students/${params.estudiante}`)
    if (ok && !data.estudiante) {
        throw redirect(302, `/pagos?regPago=${params.estudiante}`)
    }

    return {
        estudiante: data.estudiante,
        pago: data.pago,
        monto: data.monto
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    pago:async ({locals:{client}, request, params}) => {
        let obj = Object.fromEntries(await request.formData()) as unknown as any
        const payload = {
            cedula_student: params.estudiante   ,
            pre_inscripcion: obj.pre_inscripcion,
            inscripcion: obj.inscripcion,
            cuota1: obj.cuota1 ?? "",
            cuota2: obj.cuota2 ?? "",
            cuota3: obj.cuota3 ?? "",
            cuota4: obj.cuota4 ?? "",
            cuota5: obj.cuota5 ?? "",
            montoPreInscripcion: obj.monto_pre_inscripcion,
            montoInscripcion: obj.monto_inscripcion ?? 0,
            montoCuota1: obj.monto_cuota1 ?? 0,
            montoCuota2: obj.monto_cuota2 ?? 0,
            montoCuota3: obj.monto_cuota3 ?? 0,
            montoCuota4: obj.monto_cuota4 ?? 0,
            montoCuota5: obj.monto_cuota5 ?? 0
        }
        const { ok, data } = await client.PUT(`/api/admin/update/${obj.id_pago}`, payload)
        if (!ok) {
            return fail(400, {"message": data.message})
        }
    },

    estudiante:async ({locals:{client}, request, params}) => {
        let obj = Object.fromEntries(await request.formData()) as unknown as any
        const payload = {
            cedula: params.estudiante,
            fullname: obj.nombre,
            correo: obj.email,
            password: params.estudiante.replace("V-", ""),
            estado: obj.estado,
            telefono: obj.telefono,
            semestre: parseInt(obj.semestre)
        }
        const { ok, data } = await client.PUT(`/api/students/update/${payload.cedula}`, payload)
        if (!ok) {
            return fail(400, {"message": data.message})
        }
    }
};

/*   File "/venv/lib/python3.10/site-packages/itsdangerous/timed.py", line 136, in unsign
    raise BadTimeSignature(str(sig_error), payload=value, date_signed=ts_dt)
itsdangerous.exc.BadTimeSignature: Signature b'BDtMF1Ea2_oyGef--DDw3c-tW1A' does not match
The above exception was the direct cause of the following exception:
Traceback (most recent call last):
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 261, in protect
    validate_csrf(self._get_csrf_token())
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 112, in validate_csrf
    raise ValidationError("The CSRF token is invalid.") from e
wtforms.validators.ValidationError: The CSRF token is invalid.
During handling of the above exception, another exception occurred:
Traceback (most recent call last):
  File "/venv/lib/python3.10/site-packages/flask/app.py", line 1821, in full_dispatch_request
    rv = self.preprocess_request()
  File "/venv/lib/python3.10/site-packages/flask/app.py", line 2312, in preprocess_request
    rv = self.ensure_sync(before_func)()
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 229, in csrf_protect
    self.protect()
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 264, in protect
    self._error_response(e.args[0])
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 307, in _error_response
    raise CSRFError(reason)
flask_wtf.csrf.CSRFError: 400 Bad Request: The CSRF token is invalid.
186.185.175.98 - - [03/May/2023:00:13:37 +0000] "GET /misc/bgprocess/ HTTP/1.1" 400 117 "https://adminer.henrry.online/browser/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
2023-05-03 00:13:37,728: ERROR	pgadmin:	400 Bad Request: The CSRF token is invalid.
Traceback (most recent call last):
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 108, in validate_csrf
    token = s.loads(data, max_age=time_limit)
  File "/venv/lib/python3.10/site-packages/itsdangerous/timed.py", line 226, in loads
    raise _t.cast(BadSignature, last_exception)
  File "/venv/lib/python3.10/site-packages/itsdangerous/timed.py", line 210, in loads
    base64d, timestamp = signer.unsign(
  File "/venv/lib/python3.10/site-packages/itsdangerous/timed.py", line 136, in unsign
    raise BadTimeSignature(str(sig_error), payload=value, date_signed=ts_dt)
itsdangerous.exc.BadTimeSignature: Signature b'BDtMF1Ea2_oyGef--DDw3c-tW1A' does not match
The above exception was the direct cause of the following exception:
Traceback (most recent call last):
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 261, in protect
    validate_csrf(self._get_csrf_token())
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 112, in validate_csrf
    raise ValidationError("The CSRF token is invalid.") from e
wtforms.validators.ValidationError: The CSRF token is invalid.
During handling of the above exception, another exception occurred:
Traceback (most recent call last):
  File "/venv/lib/python3.10/site-packages/flask/app.py", line 1821, in full_dispatch_request
    rv = self.preprocess_request()
  File "/venv/lib/python3.10/site-packages/flask/app.py", line 2312, in preprocess_request
    rv = self.ensure_sync(before_func)()
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 229, in csrf_protect
    self.protect()
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 264, in protect
    self._error_response(e.args[0])
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 307, in _error_response
    raise CSRFError(reason)
flask_wtf.csrf.CSRFError: 400 Bad Request: The CSRF token is invalid.
186.185.175.98 - - [03/May/2023:00:13:37 +0000] "POST /settings/store HTTP/1.1" 400 117 "https://adminer.henrry.online/browser/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
2023-05-03 00:13:37,883: ERROR	pgadmin:	400 Bad Request: The CSRF token is invalid.
Traceback (most recent call last):
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 108, in validate_csrf
    token = s.loads(data, max_age=time_limit)
  File "/venv/lib/python3.10/site-packages/itsdangerous/timed.py", line 226, in loads
    raise _t.cast(BadSignature, last_exception)
  File "/venv/lib/python3.10/site-packages/itsdangerous/timed.py", line 210, in loads
    base64d, timestamp = signer.unsign(
  File "/venv/lib/python3.10/site-packages/itsdangerous/timed.py", line 136, in unsign
    raise BadTimeSignature(str(sig_error), payload=value, date_signed=ts_dt)
itsdangerous.exc.BadTimeSignature: Signature b'BDtMF1Ea2_oyGef--DDw3c-tW1A' does not match
The above exception was the direct cause of the following exception:
Traceback (most recent call last):
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 261, in protect
    validate_csrf(self._get_csrf_token())
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 112, in validate_csrf
    raise ValidationError("The CSRF token is invalid.") from e
wtforms.validators.ValidationError: The CSRF token is invalid.
During handling of the above exception, another exception occurred:
Traceback (most recent call last):
  File "/venv/lib/python3.10/site-packages/flask/app.py", line 1821, in full_dispatch_request
    rv = self.preprocess_request()
  File "/venv/lib/python3.10/site-packages/flask/app.py", line 2312, in preprocess_request
    rv = self.ensure_sync(before_func)()
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 229, in csrf_protect
    self.protect()
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 264, in protect
    self._error_response(e.args[0])
  File "/venv/lib/python3.10/site-packages/flask_wtf/csrf.py", line 307, in _error_response
    raise CSRFError(reason)
flask_wtf.csrf.CSRFError: 400 Bad Request: The CSRF token is invalid.
186.185.175.98 - - [03/May/2023:00:13:37 +0000] "GET /preferences/get_all HTTP/1.1" 400 117 "https://adminer.henrry.online/browser/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36" */